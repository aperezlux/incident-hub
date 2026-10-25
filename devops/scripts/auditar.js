// Ejecuta `npm audit --json` en backend y frontend y genera docs/reporte-dependencias.md
const { spawnSync } = require('child_process');
const fs = require('fs');

const filas = [];
let total = 0;
for (const dir of ['backend', 'frontend']) {
  const r = spawnSync('npm', ['audit', '--omit=dev', '--json'], { cwd: dir, encoding: 'utf8', shell: process.platform === 'win32' });
  let json;
  try { json = JSON.parse(r.stdout); } catch { filas.push(`| ${dir} | (no se pudo auditar: ejecute npm install primero) | - | - | - |`); continue; }
  for (const [nombre, v] of Object.entries(json.vulnerabilities || {})) {
    total++;
    const arreglo = v.fixAvailable ? (typeof v.fixAvailable === 'object' ? `actualizar ${v.fixAvailable.name}@${v.fixAvailable.version}` : 'npm audit fix') : 'sin arreglo';
    filas.push(`| ${dir} | ${nombre} | ${v.severity} | ${arreglo} | _decisión pendiente_ |`);
  }
}
const fecha = new Date().toISOString().slice(0, 10);
const md = `# Reporte de dependencias (${fecha})

Generado con \`node devops/scripts/auditar.js\` (npm audit, dependencias de producción).

| Componente | Paquete | Severidad | Arreglo disponible | Decisión |
|---|---|---|---|---|
${filas.join('\n') || '| - | Sin vulnerabilidades reportadas | - | - | - |'}

Total de hallazgos: ${total}. Complete la columna *Decisión* según la política de \`docs/dependencias.md\`.
`;
fs.writeFileSync('docs/reporte-dependencias.md', md);
console.log(md);
