# Agente autohospedado (self-hosted)

1. En Azure DevOps: **Project settings → Agent pools → Default → New agent**; copie la URL de descarga del paquete (Linux/Windows/macOS).
2. Cree un **PAT** con alcance *Agent Pools (Read & manage)*. Guárdelo solo en variables de entorno; nunca en el repo.
3. Linux/macOS: `AZP_URL=... AZP_TOKEN=... AGENT_PKG_URL=... ./devops/scripts/instalar-agente.sh`.
   Windows: descargue el zip, extraiga y ejecute `.\config.cmd` (URL de la organización, PAT, pool `Default`, nombre del agente) y luego `.\run.cmd`.
4. Verifique que el agente aparece **Online** en el pool.
5. El pipeline usa el pool mediante el parámetro `agentPool` (por defecto `Default`): `pool: name: ${{ parameters.agentPool }}`.
6. Requisitos en el agente: Git y acceso a internet para `NodeTool`/npm. Docker solo es necesario para ejecutar `docker compose` localmente.

## Evidencia a capturar
- Pool `Default` con el agente **Online** (sin mostrar tokens).
- Ejecución del pipeline con *"Agent: <su agente>"* en el encabezado del job.

## Seguridad
Ejecutar el agente con un usuario sin privilegios; revocar o rotar el PAT tras el registro.
