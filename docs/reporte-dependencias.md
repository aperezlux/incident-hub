# Reporte de dependencias (2026-10-29)

Generado con `node devops/scripts/auditar.js` (npm audit, dependencias de producción).

## Producción

| Componente | Paquete | Severidad | Arreglo disponible | Decisión |
|---|---|---|---|---|
| Backend y frontend | Sin vulnerabilidades reportadas | - | - | No aplica |

Total de hallazgos de producción: 0.

## Desarrollo

Los siguientes hallazgos provienen de `npm audit` completo. Todos pertenecen a dependencias de desarrollo o sus transitivas; no hay hallazgos de severidad alta o crítica en dependencias de producción.

| Componente | Paquete | Severidad | Arreglo disponible | Decisión |
|---|---|---|---|---|
| Backend | @jest/core | Baja | npm indica actualización mayor de jest | Aceptado: no se despliegan; actualización planificada |
| Backend | create-jest | Baja | npm indica actualización mayor de jest | Aceptado: no se despliegan; actualización planificada |
| Backend | deepmerge | Baja | npm indica actualización mayor de jest | Aceptado: no se despliegan; actualización planificada |
| Backend | jest | Baja | npm indica actualización mayor a jest@25.1.0 | Aceptado: no se despliegan; actualización planificada |
| Backend | jest-cli | Baja | npm indica actualización mayor de jest | Aceptado: no se despliegan; actualización planificada |
| Backend | jest-config | Baja | npm indica actualización mayor de jest | Aceptado: no se despliegan; actualización planificada |
| Backend | jest-junit | Moderada | npm indica actualización mayor a jest-junit@17.0.0 | Aceptado: no se despliegan; actualización planificada |
| Backend | uuid (transitiva) | Moderada | npm indica actualización mediante jest-junit@17.0.0 | Aceptado: no se despliegan; actualización planificada |
| Frontend | esbuild | Moderada | npm indica actualización mayor mediante vite@8.3.5 | Aceptado: no se despliegan; actualización planificada |
| Frontend | tinypool (transitiva) | Crítica | npm indica actualización mayor mediante vitest@5.0.5 | Aceptado: no se despliegan; actualización planificada |
| Frontend | vite | Alta | npm indica actualización mayor a vite@8.3.5 | Aceptado: no se despliegan; actualización planificada |
| Frontend | vite-node (transitiva) | Moderada | npm indica actualización mayor mediante vitest@5.0.5 | Aceptado: no se despliegan; actualización planificada |
| Frontend | vitest | Crítica | npm indica actualización mayor a vitest@5.0.5 | Aceptado: no se despliegan; actualización planificada |

Total de hallazgos de desarrollo: 13 (6 bajos, 4 moderados, 1 alto y 2 críticos). No se ejecutó `npm audit fix`.
