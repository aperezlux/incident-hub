#!/usr/bin/env python3
"""Crea proyecto, repos y backlog (Epics/Features/Stories/Tasks) en Azure DevOps a partir de devops/backlog.json.
Uso: AZ_ORG=... AZURE_DEVOPS_EXT_PAT=... python3 devops/scripts/crear_backlog.py
Opcional: ASIGNAR_D1/D2/D3/RV = correo del usuario de Azure para cada rol."""
import json, os
from azutil import *

exigir()
os.environ["AZURE_DEVOPS_EXT_PAT"] = PAT
asign = {k: os.environ.get("ASIGNAR_" + k.upper(), "") for k in ("d1", "d2", "d3", "rv")}

if az("devops", "project", "list", "--org", ORG, "--query", f"value[?name=='{PROYECTO}'].name", check=False) in (None, []):
    az("devops", "project", "create", "--name", PROYECTO, "--org", ORG, "--process", "Agile", "--source-control", "git", "--visibility", "private")
for n in (1, 2, 3):
    if not az("repos", "list", "--query", f"[?name=='incident-hub-semana{n}'].id", check=False):
        az("repos", "create", "--name", f"incident-hub-semana{n}")

items = json.load(open("devops/backlog.json", encoding="utf-8"))
ids = {}
for it in items:  # orden = IDs 1..33 en proyecto nuevo
    campos = [f"Microsoft.VSTS.Common.Priority={it['prioridad']}"]
    if it["tipo"] == "Task" and it["estimacion"]:
        campos += [f"Microsoft.VSTS.Scheduling.OriginalEstimate={it['estimacion']}", f"Microsoft.VSTS.Scheduling.RemainingWork={it['estimacion']}"]
    if it["tipo"] == "User Story":
        campos.append(f"Microsoft.VSTS.Scheduling.StoryPoints={it['estimacion']}")
    a = ["boards", "work-item", "create", "--type", it["tipo"], "--title", it["titulo"], "--fields", *campos]
    if asign.get(it["responsable"]):
        a += ["--assigned-to", asign[it["responsable"]]]
    r = az(*a)
    ids[it["id"]] = r["id"]
    if r["id"] != it["id"]:
        print(f"AVISO: el item {it['id']} obtuvo ID {r['id']} (use un proyecto nuevo para que coincidan los AB#)")
    if it["padre"]:
        az("boards", "work-item", "relation", "add", "--id", str(r["id"]), "--relation-type", "parent", "--target-id", str(ids[it["padre"]]))
    print(f"{it['tipo']:<11} AB#{r['id']} {it['titulo']}")
print("Backlog creado.")
