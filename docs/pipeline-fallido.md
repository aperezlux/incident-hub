# Fallo controlado del pipeline

**Work Item:** AB#33 · **Rama:** `fix/estado-cerrado-terminal` · **PR:** PR-13

## Síntoma
Al reabrir incidentes cerrados (commit "permitir reabrir incidentes cerrados"), el pipeline falló en el paso **Pruebas backend**:
- `dominio › CERRADO es un estado terminal` (esperaba `[]`).
- `asignación y estados › un incidente cerrado no admite más cambios` (esperaba 409, devolvió 200).

## Diagnóstico
La regla de negocio define `CERRADO` como estado terminal (`docs/arquitectura.md`). El cambio la violó en `backend/src/dominio.js`; las pruebas de dominio y de integración detectaron la regresión antes de llegar a `main`.

## Corrección
Se restauró `CERRADO: []` en `TRANSICIONES`. La reapertura se contempla desde `RESUELTO → EN_PROCESO`, que ya existía.

## Evidencia (completar con enlaces reales tras ejecutar `publicar.py 2`)
- Ejecución fallida: `<URL del run fallido>` (paso "Pruebas backend" en rojo).
- Ejecución exitosa posterior: `<URL del run exitoso>`.
