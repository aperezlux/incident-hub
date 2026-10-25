# IT Incident Hub

Aplicación web para registrar, asignar y dar seguimiento a incidentes de TI, construida como **proyecto integrador DevOps** (Azure Boards → Git → PR → CI → calidad → artefacto → versión → release).

## Stack
React (Vite) · Node.js + Express · PostgreSQL · Jest/Supertest · Vitest · ESLint · Docker · Azure Pipelines · GitHub Actions

## Requisitos
Node.js 20+, npm, Docker (para PostgreSQL), Git. Para publicar en Azure: Azure CLI + extensión `azure-devops`, Python 3.

## Instalación y ejecución local
```bash
cp .env.example .env            # defina DB_PASSWORD
docker compose up -d db         # PostgreSQL con esquema y semillas (database/)
cd backend && npm install && npm start      # API en :3000
cd frontend && npm install && npm run dev   # UI en :5173
```
Pruebas: `npm test` en `backend/` y `frontend/`. Smoke test: `tests/smoke.sh`.

## Estructura
`backend/` API · `frontend/` UI · `database/` SQL · `tests/` smoke/e2e · `devops/` scripts y backlog · `docs/` documentación · `.github/workflows/` GitHub Actions · `azure-pipelines.yml`

## Responsables (proyecto individual, identidades simuladas)
| Rol | Usuario |
|---|---|
| Backend / versionado | Dev Uno |
| Frontend / QA | Dev Dos |
| DevOps / release | Dev Tres |
| Revisión de PR | Revisor Calidad |

## Entregas
Tres repos parciales (`incident-hub-semana1..3`); ver `docs/` y `devops/scripts/` para publicarlos en Azure DevOps.
