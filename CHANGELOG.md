# Changelog

Formato basado en *Keep a Changelog* y [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - primera versión estable
### Añadido
- Documentación final (`docs/`), guion de demostración y checklist de entrega (AB#29, AB#30).

## [1.0.0-rc.1] - candidata a versión estable
### Añadido
- Versionado SemVer, `CHANGELOG.md` y verificación de coherencia de versión en el pipeline (AB#30).

## [0.9.0]
### Añadido
- Pipeline de release Dev → QA → Producción con ambientes y aprobaciones; despliegue con validación y rollback (AB#29).

## [0.4.0]
### Añadido
- Dashboard de indicadores en la interfaz (AB#23).

## [0.3.0]
### Cambiado
- Paginación del listado de incidentes (DT-02, AB#32) y manejo centralizado de errores (DT-01, AB#31).
### Corregido
- `CERRADO` vuelve a ser estado terminal tras fallo controlado del pipeline (AB#33).

## [0.2.0]
### Añadido
- CI en Azure Pipelines, agente autohospedado, GitHub Actions, gestión de secretos y análisis de dependencias (AB#24–AB#28).

## [0.1.0]
### Añadido
- Registro, consulta y filtros de incidentes; asignación y estados; bitácora; endpoint de dashboard; Docker (AB#15–AB#22).

## Reglas de versionado
- **MAJOR**: cambios incompatibles de API. **MINOR**: funcionalidad nueva compatible. **PATCH**: correcciones.
- Tags anotados `vX.Y.Z` sobre `main`; prereleases `-rc.N`.
