#!/usr/bin/env bash
# Smoke test contra una instancia en ejecución. Uso: tests/smoke.sh [URL_API]
set -euo pipefail
API="${1:-http://localhost:3000}"
curl -fsS "$API/health" | grep -q '"ok"' && echo "health OK"
ID=$(curl -fsS -X POST "$API/api/incidentes" -H 'Content-Type: application/json' \
  -d '{"titulo":"Smoke test","descripcion":"verificación","categoria":"OTROS","prioridad":"BAJA","usuario":"smoke"}' | sed -n 's/.*"id":\([0-9]*\).*/\1/p')
curl -fsS "$API/api/incidentes/$ID" >/dev/null && echo "crear/consultar OK (#$ID)"
curl -fsS "$API/api/dashboard" | grep -q abiertos && echo "dashboard OK"
