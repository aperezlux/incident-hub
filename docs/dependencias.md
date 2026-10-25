# Análisis de dependencias

## Inventario (producción)
| Componente | Paquetes directos |
|---|---|
| Backend | express, pg, cors, dotenv |
| Frontend | react, react-dom |
| Desarrollo | jest, supertest, jest-junit, eslint (+plugin react), vite, vitest, @vitejs/plugin-react |

## Proceso
1. `npm install` en `backend/` y `frontend/`.
2. `node devops/scripts/auditar.js` genera `docs/reporte-dependencias.md` con paquete, severidad y arreglo disponible.
3. Se registra una decisión por hallazgo y se comete el reporte actualizado.
4. El pipeline ejecuta `npm audit --audit-level=critical` y falla ante críticas; GitHub Actions ejecuta `dependency-review-action` (falla en severidad alta).

## Política de decisión
| Severidad | Decisión por defecto | Plazo |
|---|---|---|
| Crítica | Bloquea el pipeline; actualizar o reemplazar | Inmediato |
| Alta | Actualizar; si no hay arreglo, mitigar y documentar | 7 días |
| Media | Planificar actualización en el siguiente sprint | 30 días |
| Baja | Aceptar el riesgo con justificación | Revisión trimestral |

## Registro de decisiones
Las decisiones concretas (actualizar / aceptar riesgo / reemplazar) se anotan en `docs/reporte-dependencias.md` tras ejecutar el análisis con la red del equipo. Las dependencias de desarrollo no se despliegan, por lo que su riesgo se acepta salvo exposición de la cadena de build.

## Deuda relacionada
DT-06: versionar `package-lock.json` para instalaciones reproducibles.
