"""Utilidades comunes para los scripts de Azure DevOps (requiere Azure CLI + extensión azure-devops)."""
import base64, json, os, subprocess, sys

ORG = os.environ.get("AZ_ORG", "")          # https://dev.azure.com/SU_ORG
PROYECTO = os.environ.get("AZ_PROYECTO", "IT-Incident-Hub")
PAT = os.environ.get("AZURE_DEVOPS_EXT_PAT", "")  # nunca se escribe en el repo

def redactar_salida(salida, secretos=()):
    valores = [PAT]
    if PAT:
        valores.append(base64.b64encode((":" + PAT).encode()).decode())
    valores.extend(secretos)
    for valor in valores:
        if valor:
            salida = salida.replace(valor, "<redacted>")
    return salida

def exigir():
    faltan = [n for n, v in (("AZ_ORG", ORG), ("AZURE_DEVOPS_EXT_PAT", PAT)) if not v]
    if faltan:
        sys.exit("Defina las variables de entorno: " + ", ".join(faltan))

def az(*args, json_out=True, check=True):
    ejecutable = "az.cmd" if os.name == "nt" else "az"
    cmd = [ejecutable, *args]
    if "--org" not in args:
        cmd.extend(["--org", ORG])

    comando_general = args[:1] == ("devops",)
    relacion_work_item = args[:3] == ("boards", "work-item", "relation")
    actualizacion_work_item = args[:3] == ("boards", "work-item", "update")
    if not comando_general and not relacion_work_item and not actualizacion_work_item:
        cmd.extend(["--project", PROYECTO])

    cmd += ["-o", "json"] if json_out else ["-o", "tsv"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode and check:
        safe_cmd = []
        secret_values = []
        redact_next = False
        for arg in cmd:
            if redact_next:
                safe_cmd.append("<redacted>")
                secret_values.append(arg)
                redact_next = False
            elif arg.lower() in ("--token", "--password", "--secret", "--pat", "--client-secret"):
                safe_cmd.append(arg)
                redact_next = True
            elif "=" in arg and any(
                field in arg.split("=", 1)[0].lower()
                for field in ("password", "secret", "token", "pat", "credential")
            ):
                key, value = arg.split("=", 1)
                safe_cmd.append(key + "=<redacted>")
                secret_values.append(value)
            else:
                safe_cmd.append(arg)
        safe_stderr = redactar_salida(r.stderr, secret_values)
        sys.exit(f"Falló: {' '.join(safe_cmd)}\n{safe_stderr}")
    if not json_out:
        return r.stdout.strip()
    return json.loads(r.stdout) if r.stdout.strip() else None

def git(*args, check=True):
    r = subprocess.run(["git", *args], capture_output=True, text=True)
    if r.returncode and check:
        safe_args = [
            "http.extraheader=<redacted>"
            if arg.startswith("http.extraheader=Authorization: Basic ")
            else arg
            for arg in args
        ]
        safe_stderr = redactar_salida(r.stderr)
        sys.exit(f"git {' '.join(safe_args)}\n{safe_stderr}")
    return r.stdout.strip()

def git_push(remoto_url, refspec):
    auth = base64.b64encode((":" + PAT).encode()).decode()
    return git("-c", f"http.extraheader=Authorization: Basic {auth}", "push", remoto_url, refspec)