# Fallo controlado del pipeline

**Work Item:** AB#33 · **Rama:** `fix/estado-cerrado-regresion` · **PR:** PR-21 (#17) · **Pipeline:** `incident-hub-ci-s2`

## Síntoma
El commit "permitir reabrir incidentes cerrados" hizo fallar el paso **Pruebas backend (con cobertura)**:
- `dominio › CERRADO es un estado terminal` (esperaba `[]`).
- `asignación y estados › un incidente cerrado no admite más cambios` (esperaba 409).

## Diagnóstico
La regla de negocio define `CERRADO` como estado terminal (`docs/arquitectura.md`). El cambio la violó en `backend/src/dominio.js` y las pruebas de dominio e integración detectaron la regresión antes de llegar a `main`.

## Corrección
Commit "restaurar CERRADO como estado terminal": se vuelve a `CERRADO: []`. La reapertura sigue disponible desde `RESUELTO → EN_PROCESO`.

## Evidencia
- Ejecución fallida (paso "Pruebas backend (con cobertura)"): https://dev.azure.com/incidenthub-aperezl48/IT-Incident-Hub/_build/results?buildId=8
- Ejecución exitosa posterior: https://dev.azure.com/incidenthub-aperezl48/IT-Incident-Hub/_build/results?buildId=9

## Intento previo
Los runs #3 y #4 (rama `fix/estado-cerrado-terminal`) fallaron en **Lint frontend** porque esa rama se creó antes del PR-20 (fix de lint). Por eso se repitió la demostración desde un `main` sano; esos runs se conservan como historial.
