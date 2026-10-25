"""Utilidades comunes para los scripts de Azure DevOps (requiere Azure CLI + extensión azure-devops)."""
import base64, json, os, subprocess, sys

ORG = os.environ.get("AZ_ORG", "")          # https://dev.azure.com/SU_ORG
PROYECTO = os.environ.get("AZ_PROYECTO", "IT-Incident-Hub")
PAT = os.environ.get("AZURE_DEVOPS_EXT_PAT", "")  # nunca se escribe en el repo

def exigir():
    faltan = [n for n, v in (("AZ_ORG", ORG), ("AZURE_DEVOPS_EXT_PAT", PAT)) if not v]
    if faltan:
        sys.exit("Defina las variables de entorno: " + ", ".join(faltan))

def az(*args, json_out=True, check=True):
    cmd = ["az", *args, "--org", ORG, "--project", PROYECTO] if args[0] != "devops" else ["az", *args]
    cmd += ["-o", "json"] if json_out else ["-o", "tsv"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode and check:
        sys.exit(f"Falló: {' '.join(cmd)}\n{r.stderr}")
    if not json_out:
        return r.stdout.strip()
    return json.loads(r.stdout) if r.stdout.strip() else None

def git(*args, check=True):
    r = subprocess.run(["git", *args], capture_output=True, text=True)
    if r.returncode and check:
        sys.exit(f"git {' '.join(args)}\n{r.stderr}")
    return r.stdout.strip()

def git_push(remoto_url, refspec):
    auth = base64.b64encode((":" + PAT).encode()).decode()
    return git("-c", f"http.extraheader=Authorization: Basic {auth}", "push", remoto_url, refspec)
