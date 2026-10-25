# Backlog del proyecto

IDs asumen un proyecto Azure DevOps nuevo (proceso Agile): se crean en este orden y obtienen los IDs 1..33.

| ID | Tipo | Título | Padre | Prio | Est. | Responsable | Semana |
|---|---|---|---|---|---|---|---|
| AB#1 | Epic | Gestión de incidentes | - | 1 | 0 | Dev Uno | 1 |
| AB#2 | Epic | Plataforma DevOps y entrega continua | - | 1 | 0 | Dev Tres | 2 |
| AB#3 | Feature | Registro y consulta de incidentes | AB#1 | 1 | 0 | Dev Uno | 1 |
| AB#4 | Feature | Operación, seguimiento e indicadores | AB#1 | 2 | 0 | Dev Tres | 1 |
| AB#5 | Feature | Integración continua, calidad y seguridad | AB#2 | 1 | 0 | Dev Tres | 2 |
| AB#6 | Feature | Lanzamiento controlado y versionado | AB#2 | 2 | 0 | Dev Uno | 3 |
| AB#7 | User Story | Como usuario quiero registrar un incidente para que TI lo atienda | AB#3 | 1 | 5 pts | Dev Uno | 1 |
| AB#8 | User Story | Como usuario quiero consultar y filtrar incidentes por estado, prioridad, categoría y técnico | AB#3 | 1 | 5 pts | Dev Dos | 1 |
| AB#9 | User Story | Como coordinador quiero asignar un técnico y cambiar el estado de un incidente | AB#4 | 1 | 8 pts | Dev Tres | 1 |
| AB#10 | User Story | Como técnico quiero registrar comentarios en una bitácora por incidente | AB#4 | 2 | 5 pts | Dev Dos | 1 |
| AB#11 | User Story | Como jefe de TI quiero un dashboard con indicadores de incidentes | AB#4 | 2 | 5 pts | Dev Dos | 3 |
| AB#12 | User Story | Como equipo quiero un pipeline de CI con pruebas, calidad y seguridad | AB#5 | 1 | 8 pts | Dev Tres | 2 |
| AB#13 | User Story | Como equipo quiero gestionar secretos y dependencias de forma segura | AB#5 | 1 | 5 pts | Dev Tres | 2 |
| AB#14 | User Story | Como equipo quiero una estrategia de release y versionado semántico hasta v1.0.0 | AB#6 | 1 | 8 pts | Dev Uno | 3 |
| AB#15 | Task | Esquema de base de datos y datos semilla | AB#7 | 1 | 4h | Dev Uno | 1 |
| AB#16 | Task | API REST: crear y consultar incidentes | AB#7 | 1 | 6h | Dev Uno | 1 |
| AB#17 | Task | Frontend: formulario de registro de incidentes | AB#7 | 2 | 5h | Dev Dos | 1 |
| AB#18 | Task | API REST: filtros de consulta | AB#8 | 2 | 4h | Dev Uno | 1 |
| AB#19 | Task | Frontend: listado y filtros | AB#8 | 2 | 5h | Dev Dos | 1 |
| AB#20 | Task | API: asignar técnico y transiciones de estado | AB#9 | 1 | 6h | Dev Tres | 1 |
| AB#21 | Task | API: comentarios y bitácora | AB#10 | 2 | 4h | Dev Dos | 1 |
| AB#22 | Task | Frontend: detalle, asignación, estados y bitácora | AB#10 | 2 | 6h | Dev Tres | 1 |
| AB#23 | Task | API e interfaz del dashboard de indicadores | AB#11 | 2 | 6h | Dev Uno | 3 |
| AB#24 | Task | Pipeline de Azure: build, pruebas, seguridad y artefacto | AB#12 | 1 | 6h | Dev Tres | 2 |
| AB#25 | Task | Configurar y usar agente autohospedado | AB#12 | 1 | 3h | Dev Tres | 2 |
| AB#26 | Task | Workflow complementario de GitHub Actions | AB#12 | 2 | 3h | Dev Dos | 2 |
| AB#27 | Task | Gestión de secretos con variable group protegido | AB#13 | 1 | 3h | Dev Tres | 2 |
| AB#28 | Task | Análisis de dependencias y decisión por vulnerabilidad | AB#13 | 2 | 3h | Dev Uno | 2 |
| AB#29 | Task | Estrategia de release: ambientes y aprobaciones | AB#14 | 1 | 6h | Dev Tres | 3 |
| AB#30 | Task | Versionado SemVer, CHANGELOG y tags hasta v1.0.0 | AB#14 | 2 | 3h | Dev Uno | 3 |
| AB#31 | Task | Deuda técnica: manejo centralizado de errores | AB#8 | 2 | 3h | Dev Uno | 2 |
| AB#32 | Task | Deuda técnica: paginación del listado | AB#8 | 3 | 3h | Dev Dos | 2 |
| AB#33 | Task | Bug: reabrir incidentes CERRADOS rompe la regla de estados | AB#9 | 1 | 2h | Dev Dos | 2 |

Total: 2 Epics, 4 Features, 8 User Stories y 19 Tasks (incluye 2 de deuda técnica y 1 bug).
