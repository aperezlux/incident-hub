# Guion de demostración final

1. **Necesidad de negocio** (Azure Boards): mostrar Epic → Feature → User Story → Task con responsables, prioridad y estimación (`docs/backlog.md`).
2. **Trazabilidad**: abrir una Task (p. ej. AB#20) → rama `feature/api-estados-asignacion` → commits con `AB#20` → PR-04 con work item vinculado y revisión (`docs/trazabilidad.md`).
3. **Pull Requests**: mostrar PR-04 y PR-13 (descripción, revisor, validación) y el historial de `main` sin commits directos.
4. **Pipeline**: ejecución en el **agente autohospedado**: lint → pruebas → cobertura → `npm audit` → empaquetado → artefacto.
5. **Fallo controlado**: run fallido (AB#33) → diagnóstico (`docs/pipeline-fallido.md`) → corrección → run exitoso.
6. **Seguridad**: variable group con `DB_PASSWORD` secreta, escaneo de secretos, `docs/dependencias.md`, GitHub Actions en un PR.
7. **Aplicación**: `docker compose up -d --build`; crear incidente → asignar técnico → cambiar estados → comentar → filtrar → dashboard.
8. **Release**: artefacto → Dev (auto) → QA (aprobación) → Producción (aprobación); mostrar tags `v0.1.0 … v1.0.0` y `CHANGELOG.md`.
9. **Deuda técnica**: DT-01 y DT-02 resueltas por `refactor/*` (AB#31, AB#32); DT-03…DT-07 abiertas con justificación.

## Preguntas probables de la defensa
- *¿Por qué `main` es estable?* Solo recibe PR revisados con CI en verde; no hay commits directos.
- *¿Dónde viven los secretos?* En el variable group protegido y variables de entorno; el pipeline los verifica sin imprimirlos y escanea el repo.
- *¿Cómo se revierte un release?* `desplegar.js` revierte solo si falla la validación; manual con `--rollback <ambiente>`.
- *¿Cómo se garantiza que `CERRADO` es terminal?* `TRANSICIONES` en `dominio.js` + pruebas de dominio e integración (AB#33).
- *¿Qué cambiaría para producción real?* Autenticación (DT-03), CORS restringido (DT-04), migraciones (DT-05), lockfiles (DT-06) y despliegue a infraestructura real (DT-07).
