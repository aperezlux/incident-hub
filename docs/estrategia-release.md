# Estrategia de release

## Ambientes
| Ambiente | Disparo | Control |
|---|---|---|
| **Dev** | Automático al integrar en `main` y pasar CI | Validación automática (smoke del artefacto) |
| **QA** | Tras Dev exitoso | **Aprobación manual** (Approvals and checks del ambiente `QA`) + validación |
| **Producción** | Tras QA exitoso | **Aprobación manual** del responsable (ambiente `Produccion`) + validación |

Un mismo artefacto (`incident-hub`) se construye una vez y se promueve entre ambientes: no se recompila.

## Flujo
`Work Item → feature/* → PR revisado → main → pipeline CI (lint, pruebas, seguridad) → artefacto → Dev → QA (aprobación) → Producción (aprobación) → tag SemVer`.

## Controles
- Solo `main` despliega (condición `Build.SourceBranch`); las ramas de PR solo ejecutan CI.
- `devops/scripts/desplegar.js` valida el artefacto (VERSION.json, backend, frontend compilado, SQL) y **revierte automáticamente** a la versión anterior si falla.
- Rollback manual: `node devops/scripts/desplegar.js --rollback <ambiente>`.
- Criterio de promoción: CI en verde, sin vulnerabilidades críticas, Work Items vinculados, aprobación explícita en QA y Producción.

## Configuración de aprobaciones (una vez)
Pipelines → Environments → `QA` y `Produccion` → ⋯ → *Approvals and checks* → *Approvals* → agregar aprobador (otro usuario distinto del autor).

## Alcance y limitaciones
El despliegue es **simulado**: publica el artefacto en una carpeta por ambiente (`DEPLOY_ROOT`, por defecto `~/incident-hub-despliegues/<ambiente>`) en el agente. Para producción real se sustituiría el paso por despliegue a un servicio (App Service, contenedores, etc.) manteniendo las mismas etapas y controles.
