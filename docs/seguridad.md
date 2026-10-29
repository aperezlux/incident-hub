# Seguridad y gestión de secretos

## Reglas
- Ninguna credencial, token o clave se versiona. `.env` está en `.gitignore`; solo existe `.env.example` con valores de ejemplo.
- Azure Pipelines: secretos en el **variable group** `incident-hub-secrets` (Pipelines → Library) con `DB_PASSWORD` marcada como *secret* (se enmascara en logs). El pipeline la recibe vía `env:`; nunca se imprime.
- GitHub Actions: no requiere secretos; si se agregaran, usar *Repository secrets*.
- PATs (agente, scripts de publicación): solo en variables de entorno de quien los ejecuta; alcance mínimo; rotación tras la entrega.
- Docker Compose exige `DB_PASSWORD` desde `.env` (`${DB_PASSWORD:?}`), sin valor por defecto.

## Controles automáticos
- `devops/scripts/buscar-secretos.js` (paso del pipeline): falla si detecta claves privadas, AKIA, posibles PAT o credenciales literales en archivos versionados.
- `npm audit` y `dependency-review-action`: ver `docs/dependencias.md`.
- Revisión de PR: checklist "sin secretos en el diff".

## Respuesta ante fuga
1. Revocar/rotar la credencial de inmediato. 2. Eliminarla del historial si procede. 3. Registrar el incidente como Work Item.

## Riesgos conocidos
Ver DT-03 (sin autenticación) y DT-04 (CORS abierto) en `docs/deuda-tecnica.md`.
Prueba de espejo GitHub Actions preparada; no se publica desde Azure DevOps.
