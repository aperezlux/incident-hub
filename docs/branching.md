# Estrategia de ramas

- `main` siempre estable: solo recibe cambios por Pull Request revisado.
- Ramas de trabajo: `feature/*`, `fix/*`, `refactor/*`, `chore/*`, `docs/*`.
- Commits: `tipo(alcance): descripción AB#<ID>` (Conventional Commits + vínculo a Work Item).
- Flujo: Task (Azure Boards) → rama → commits con `AB#ID` → PR con work items vinculados → revisión → pipeline → merge (no fast-forward) → artefacto → release.
- Versionado: SemVer con tags anotados (`v0.1.0` … `v1.0.0`).
- Trazabilidad completa en `docs/trazabilidad.md` y `docs/pull-requests/`.
