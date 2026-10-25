#!/usr/bin/env bash
# Instala y registra un agente autohospedado de Azure Pipelines en Linux/macOS.
# Variables requeridas (NO guardarlas en el repo):
#   AZP_URL         https://dev.azure.com/SU_ORG
#   AZP_TOKEN       PAT con alcance "Agent Pools (Read & manage)"
#   AGENT_PKG_URL   URL del paquete del agente (Azure DevOps > Project settings > Agent pools > New agent > Download)
# Opcionales: AZP_POOL (def. Default), AZP_AGENT_NAME (def. hostname)
set -euo pipefail
: "${AZP_URL:?}" "${AZP_TOKEN:?}" "${AGENT_PKG_URL:?}"
POOL="${AZP_POOL:-Default}"; NOMBRE="${AZP_AGENT_NAME:-$(hostname)}"
mkdir -p _agente && cd _agente
curl -fsSL "$AGENT_PKG_URL" -o agente.tar.gz
tar xzf agente.tar.gz
./config.sh --unattended --url "$AZP_URL" --auth pat --token "$AZP_TOKEN" --pool "$POOL" --agent "$NOMBRE" --acceptTeeEula --replace
echo "Agente '$NOMBRE' registrado en el pool '$POOL'. Ejecute ./run.sh (interactivo) o: sudo ./svc.sh install && sudo ./svc.sh start"
