#!/usr/bin/env python3
"""Continua el fallo controlado (AB#33): el commit defectuoso ya esta en la rama y el run 8 fallo en Pruebas backend.
Aplica la correccion, espera el run exitoso, crea y completa el PR-21 y documenta la evidencia."""
import base64, os, subprocess, sys, tempfile, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from azutil import ORG, PROYECTO, PAT, az, exigir, redactar_salida

exigir()
REPO, PIPE, RAMA = "incident-hub-semana2", "incident-hub-ci-s2", "fix/estado-cerrado-regresion"
RUN_FALLIDO = 8
POOL = os.environ.get("AGENT_POOL", "Default")
AUTOR = ("Dev Dos", "dev2@incident-hub.local")
HDR = "http.extraheader=Authorization: Basic " + base64.b64encode((":" + PAT).encode()).decode()
LOCAL = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
PREVIOS = (3, 4)

def g(cwd, *a, remoto=False):
    cmd = ["git"] + (["-c", HDR] if remoto else []) + list(a)
    env = dict(os.environ, GIT_AUTHOR_NAME=AUTOR[0], GIT_AUTHOR_EMAIL=AUTOR[1],
               GIT_COMMITTER_NAME=AUTOR[0], GIT_COMMITTER_EMAIL=AUTOR[1])
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=env)
    if r.returncode:
        sys.exit("git " + " ".join(a[:2]) + " fallo:\n" + redactar_salida(r.stderr))
    return r.stdout.strip()

def url_run(i):
    return f"{ORG}/{PROYECTO}/_build/results?buildId={i}"

def correr():
    r = az("pipelines", "run", "--name", PIPE, "--branch", RAMA, "--parameters", f"agentPool={POOL}")
    rid = r["id"]
    print(f"  run #{rid} en cola/ejecucion ... {url_run(rid)}", flush=True)
    for _ in range(160):
        x = az("pipelines", "runs", "show", "--id", str(rid))
        if x["status"] == "completed":
            return rid, x["result"]
        time.sleep(15)
    sys.exit("Tiempo agotado esperando el run")

def pasos_fallidos(rid):
    t = az("devops", "invoke", "--area", "build", "--resource", "timeline", "--route-parameters",
           f"project={PROYECTO}", f"buildId={rid}", "--org", ORG, "--api-version", "7.1")
    return [r["name"] for r in t["records"] if r.get("type") == "Task" and r.get("result") == "failed"]

print("0) Verificando el run fallido", RUN_FALLIDO, flush=True)
x = az("pipelines", "runs", "show", "--id", str(RUN_FALLIDO))
paso1 = pasos_fallidos(RUN_FALLIDO)
if x["result"] != "failed" or not any(p.startswith("Pruebas backend") for p in paso1):
    sys.exit(f"El run {RUN_FALLIDO} no fallo en Pruebas backend: {x['result']} {paso1}")
paso1 = [p for p in paso1 if p.startswith("Pruebas backend")]
rid1 = RUN_FALLIDO

info = az("repos", "show", "--repository", REPO)
base = tempfile.mkdtemp(prefix="fallo2_")
wc = os.path.join(base, "repo")
print("1) Clonando", REPO, "y bajando la rama", RAMA, flush=True)
g(base, "clone", info["remoteUrl"], "repo", remoto=True)
g(wc, "checkout", "-b", RAMA, "origin/" + RAMA)
if "permitir reabrir" not in g(wc, "log", "-1", "--format=%s"):
    sys.exit("El ultimo commit de la rama no es el defectuoso esperado; abortando")
p = os.path.join(wc, "backend", "src", "dominio.js")
b = open(p, "rb").read()
if b"  CERRADO: ['EN_PROCESO']" not in b:
    sys.exit("dominio.js no tiene el defecto esperado; abortando")

print("2) Correccion", flush=True)
open(p, "wb").write(b.replace(b"  CERRADO: ['EN_PROCESO']", b"  CERRADO: []", 1))
g(wc, "add", "-A"); g(wc, "commit", "-m", "fix(dominio): restaurar CERRADO como estado terminal AB#33")
g(wc, "push", "origin", RAMA, remoto=True)
rid2, res2 = correr()
print(f"  resultado: {res2}")
if res2 != "succeeded":
    sys.exit("El run corregido no paso. Detenido: revisa el log y no relances a ciegas.")

print("3) Pull request", flush=True)
desc = "Corrige la regresion de estado CERRADO (AB#33) | Run fallido y run exitoso documentados en docs/pipeline-fallido.md | Ver docs/pull-requests/PR-21.md"
pr = az("repos", "pr", "create", "--repository", REPO, "--source-branch", RAMA, "--target-branch", "main",
        "--title", "PR-21: Fallo controlado de pipeline y correccion de CERRADO", "--description", desc, "--work-items", "33")
prid = pr["pullRequestId"]

def escribir(rel, texto, anexar=False):
    for raiz in (wc, LOCAL):
        q = os.path.join(raiz, *rel.split("/"))
        if not os.path.isdir(os.path.dirname(q)):
            continue
        t = texto
        if anexar and os.path.exists(q) and not open(q, encoding="utf-8").read().endswith("\n"):
            t = "\n" + t
        with open(q, "a" if anexar else "w", encoding="utf-8", newline="\n") as f:
            f.write(t)

escribir("docs/pipeline-fallido.md", f"""# Fallo controlado del pipeline

**Work Item:** AB#33 · **Rama:** `{RAMA}` · **PR:** PR-21 (#{prid}) · **Pipeline:** `{PIPE}`

## Síntoma
El commit "permitir reabrir incidentes cerrados" hizo fallar el paso **{paso1[0]}**:
- `dominio › CERRADO es un estado terminal` (esperaba `[]`).
- `asignación y estados › un incidente cerrado no admite más cambios` (esperaba 409).

## Diagnóstico
La regla de negocio define `CERRADO` como estado terminal (`docs/arquitectura.md`). El cambio la violó en `backend/src/dominio.js` y las pruebas de dominio e integración detectaron la regresión antes de llegar a `main`.

## Corrección
Commit "restaurar CERRADO como estado terminal": se vuelve a `CERRADO: []`. La reapertura sigue disponible desde `RESUELTO → EN_PROCESO`.

## Evidencia
- Ejecución fallida (paso "{paso1[0]}"): {url_run(rid1)}
- Ejecución exitosa posterior: {url_run(rid2)}

## Intento previo
Los runs #{PREVIOS[0]} y #{PREVIOS[1]} (rama `fix/estado-cerrado-terminal`) fallaron en **Lint frontend** porque esa rama se creó antes del PR-20 (fix de lint). Por eso se repitió la demostración desde un `main` sano; esos runs se conservan como historial.
""")
escribir("docs/pull-requests/PR-21.md", f"""# PR-21: Fallo controlado de pipeline y corrección de CERRADO

- **Rama:** `{RAMA}` → `main`
- **Autor:** Dev Dos
- **Revisor:** Revisor Calidad
- **Work Items:** AB#33

## Descripción
Repite el fallo controlado: un commit rompe la regla de CERRADO (falla Pruebas backend) y el siguiente la restaura (pipeline en verde). Evidencia en `docs/pipeline-fallido.md`.

## Evidencia de validación
- Run fallido: {url_run(rid1)}
- Run exitoso: {url_run(rid2)}

## Resultado de la revisión
- Revisor: Revisor Calidad
- Decisión: **Aprobado**
""")
escribir("docs/trazabilidad.md", f"| PR-21 | `{RAMA}` | AB#33 | Dev Dos | 2 | - |\n", anexar=True)
g(wc, "add", "-A"); g(wc, "commit", "-m", "docs(pipeline): evidencia real del fallo controlado AB#33")
g(wc, "push", "origin", RAMA, remoto=True)

print("4) Aprobar y completar", flush=True)
az("repos", "pr", "set-vote", "--id", str(prid), "--vote", "approve", check=False)
cmd = ["az.cmd" if os.name == "nt" else "az", "repos", "pr", "update", "--id", str(prid), "--status", "completed",
       "--delete-source-branch", "false", "--merge-commit-message", "Merged PR-21: Fallo controlado y correccion de CERRADO AB#33",
       "--org", ORG, "-o", "json"]
r = subprocess.run(cmd, capture_output=True, text=True)
if r.returncode:
    sys.exit("No se pudo completar el PR:\n" + redactar_salida(r.stderr))
az("boards", "work-item", "update", "--id", "33", "--state", "Closed")
print(f"\nListo. Run fallido: {url_run(rid1)}\nRun exitoso: {url_run(rid2)}\nPR #{prid} completado.")
