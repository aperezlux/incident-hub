# IT Incident Hub

Aplicación web para registrar, asignar y dar seguimiento a incidentes de TI, construida como **proyecto integrador DevOps** (Azure Boards → Git → PR → CI → calidad → artefacto → versión → release). Versión actual: **1.0.0**.

## Stack
React (Vite) · Node.js + Express · PostgreSQL · Jest/Supertest · Vitest · ESLint · Docker · Azure Pipelines · GitHub Actions

## Requisitos
Node.js 20+, npm, Docker, Git. Para publicar en Azure: Azure CLI + extensión `azure-devops` y Python 3.

## Instalación y ejecución
```bash
cp .env.example .env                    # defina DB_PASSWORD (no se versiona)
docker compose up -d --build            # db + api (:3000) + ui (:8080)
tests/smoke.sh http://localhost:3000    # verificación rápida
```
Desarrollo sin Docker: `docker compose up -d db`, luego `cd backend && npm install && npm start` y `cd frontend && npm install && npm run dev` (UI en :5173).
Pruebas y lint: `npm test` / `npm run lint` en `backend/` y `frontend/`.

## API
`POST/GET /api/incidentes` (filtros `estado, prioridad, categoria, tecnico`; paginación `limite, pagina`) · `GET /api/incidentes/:id` · `PATCH /:id/asignar` · `PATCH /:id/estado` · `GET/POST /:id/comentarios` · `GET /api/dashboard` · `GET /health`.

## Estructura
`backend/` API · `frontend/` UI · `database/` SQL · `tests/` smoke · `devops/` scripts, backlog y PRs · `docs/` documentación · `.github/workflows/` GitHub Actions · `azure-pipelines.yml`.

## Documentación (`docs/`)
arquitectura · branching · deuda-tecnica · seguridad · dependencias · estrategia-release · backlog · trazabilidad · pipeline-fallido · guion-demo · checklist-entrega · pull-requests/

## Publicación en Azure DevOps
```bash
export AZ_ORG=https://dev.azure.com/SU_ORG AZURE_DEVOPS_EXT_PAT=...   # PAT solo en su terminal
python3 devops/scripts/crear_backlog.py       # proyecto, repos y 33 work items (AB#1..33)
python3 devops/scripts/publicar.py 1          # semana 1: ramas, PR, aprobación, merge, tags
python3 devops/scripts/publicar.py 2          # requiere agente autohospedado (devops/self-hosted-agent.md)
python3 devops/scripts/publicar.py 3
```

## Responsables (proyecto individual, identidades simuladas)
| Rol | Usuario |
|---|---|
| Backend / versionado | Dev Uno |
| Frontend / QA | Dev Dos |
| DevOps / release | Dev Tres |
| Revisión de PR | Revisor Calidad |
