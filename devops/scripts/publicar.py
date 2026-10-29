#!/usr/bin/env python3
"""Publica una semana del proyecto en su repo de Azure DevOps y automatiza el flujo
rama -> PR (con work items) -> aprobación -> merge -> cierre de work items -> tag.
Uso: python3 devops/scripts/publicar.py <1|2|3>
Variables: AZ_ORG, AZURE_DEVOPS_EXT_PAT (obligatorias), AZ_PROYECTO, AGENT_POOL (def. Default), INCIDENT_DB_PASSWORD (sem. 2)."""
import base64, getpass, json, os, subprocess, sys, time
from azutil import *

exigir()
semana = int(sys.argv[1])
POOL = os.environ.get("AGENT_POOL", "Default")
repo = f"incident-hub-semana{semana}"
prs = [p for p in json.load(open("devops/prs.json", encoding="utf-8")) if p["semana"] == semana]
info = az("repos", "show", "--repository", repo)
url = info["remoteUrl"]
backlog = {b["id"]: b for b in json.load(open("devops/backlog.json", encoding="utf-8"))}

# main del repo parcial = estado al inicio de la semana (tag local base-sN)
auth = base64.b64encode((":" + PAT).encode()).decode()
consulta_main = subprocess.run(
    ["git", "-c", f"http.extraheader=Authorization: Basic {auth}",
     "ls-remote", "--heads", url, "refs/heads/main"],
    capture_output=True, text=True,
)
if consulta_main.returncode:
    sys.exit(
        "Falló: git ls-remote --heads <repositorio> refs/heads/main\n"
        + redactar_salida(consulta_main.stderr)
    )
if consulta_main.stdout.strip():
    print("  La rama main remota ya existe; se conserva sin sobrescribirla.")
else:
    git_push(url, f"refs/tags/base-s{semana}^{{commit}}:refs/heads/main")

def estado(ids, nuevo):
    for i in ids:
        az("boards", "work-item", "update", "--id", str(i), "--state", nuevo)

def esperar(run_id):
    for _ in range(80):
        r = az("pipelines", "runs", "show", "--id", str(run_id))
        if r["status"] == "completed":
            return r["result"]
        time.sleep(15)
    return "timeout"

PIPE = f"incident-hub-ci-s{semana}"

def crear_pipeline():
    az("pipelines", "create", "--name", PIPE, "--repository", repo, "--repository-type", "tfsgit",
       "--branch", "main", "--yml-path", "azure-pipelines.yml", "--skip-first-run", "true")
    print(f"  Pipeline '{PIPE}' creado. Si pide permiso de uso del pool o del variable group, autorícelo en Azure DevOps.")

def crear_ambientes():
    for nombre in ("Dev", "QA", "Produccion"):
        cuerpo = f"/tmp/env_{nombre}.json"
        json.dump({"name": nombre, "description": f"Ambiente {nombre} de IT Incident Hub"}, open(cuerpo, "w"))
        az("devops", "invoke", "--area", "distributedtask", "--resource", "environments", "--http-method", "POST",
           "--in-file", cuerpo, "--api-version", "7.1", "--route-parameters", f"project={PROYECTO}", "--org", ORG, check=False)
    print("  Ambientes Dev/QA/Produccion creados. Configure aprobaciones en Pipelines > Environments > QA / Produccion > Approvals and checks.")

def correr(rama):
    r = az("pipelines", "run", "--name", PIPE, "--branch", rama, "--parameters", f"agentPool={POOL}")
    print(f"  pipeline run #{r['id']} en {rama} ...")
    res = esperar(r["id"]); print(f"  resultado: {res}")
    return r["id"], res

if semana == 3:
    crear_pipeline()
    crear_ambientes()

for p in prs:
    n, rama = p["num"], p["rama"]
    print(f"\n== PR-{n:02d} {rama}")
    if p.get("crear_grupo_secretos"):
        clave = os.environ.get("INCIDENT_DB_PASSWORD") or getpass.getpass("Clave de BD para el variable group (no se guarda en el repo): ")
        g = az("pipelines", "variable-group", "create", "--name", "incident-hub-secrets", "--authorize", "true", "--variables", "ENTORNO=ci", f"DB_PASSWORD={clave}")
        az("pipelines", "variable-group", "variable", "update", "--group-id", str(g["id"]), "--name", "DB_PASSWORD", "--secret", "true")
    if p.get("roto_primero"):
        roto = git("log", "--format=%H", "-n", "1", "--grep", "permitir reabrir incidentes cerrados", rama)
        git_push(url, f"{roto}:refs/heads/{rama}")
        print("  Ejecutando pipeline con el commit defectuoso (se espera FALLO) ...")
        rid, res = correr(rama)
        print(f"  Evidencia: run #{rid} = {res}. Capture el log; luego se sube la corrección.")
    git_push(url, f"refs/heads/{rama}:refs/heads/{rama}")
    desc = (f"{p['titulo']} | Work items: " + ", ".join(f"AB#{w}" for w in p["wis"]) +
            f" | Ver docs/pull-requests/PR-{n:02d}.md (descripción, validación y checklist).")
    try:
        pr = az("repos", "pr", "create", "--repository", repo, "--source-branch", rama, "--target-branch", "main",
                "--title", f"PR-{n:02d}: {p['titulo']}", "--description", desc, "--work-items", *[str(w) for w in p["wis"]])
    except SystemExit as error:
        if "TF401179" not in str(error):
            raise
        existentes = az("repos", "pr", "list", "--repository", repo, "--source-branch", rama,
                        "--target-branch", "main", "--status", "active")
        pr = next((item for item in existentes or [] if item.get("pullRequestId")), None)
        if pr is None:
            raise error
        print(f"  PR activo existente #{pr['pullRequestId']}; se continuará con su aprobación y merge.")
    estado(p["wis"], "Active")
    if p.get("roto_primero"):
        print("  Ejecutando pipeline con la corrección (se espera ÉXITO) ...")
        correr(rama)
    az("repos", "pr", "set-vote", "--id", str(pr["pullRequestId"]), "--vote", "approve", check=False)
    comando = [
        "az.cmd" if os.name == "nt" else "az",
        "repos", "pr", "update", "--id", str(pr["pullRequestId"]),
        "--status", "completed", "--delete-source-branch", "false",
        "--merge-commit-message", f"Merged PR-{n:02d}: {p['titulo']} AB#{p['wis'][0]}",
        "--org", ORG, "-o", "json",
    ]
    resultado = subprocess.run(comando, capture_output=True, text=True)
    if resultado.returncode:
        sys.exit(f"Falló: {' '.join(comando)}\n{redactar_salida(resultado.stderr)}")
    if resultado.stdout.strip():
        json.loads(resultado.stdout)
    estado(p["cerrar"], "Closed")
    if p.get("crear_pipeline"):
        crear_pipeline()
    if p["tag"]:
        git("-c", f"http.extraheader=Authorization: Basic {auth}", "fetch", url, "main")
        git("tag", "-f", "-a", p["tag"], "-m", f"Release {p['tag']}", "FETCH_HEAD")
        git_push(url, f"refs/tags/{p['tag']}")
        print(f"  tag {p['tag']} publicado")
print(f"\nSemana {semana} publicada en {repo}.")
