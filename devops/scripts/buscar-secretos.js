// Escaneo simple de secretos en archivos versionados. Falla (exit 1) si encuentra coincidencias.
const { execSync } = require('child_process');
const fs = require('fs');

const patrones = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'clave privada'],
  [/AKIA[0-9A-Z]{16}/, 'access key de AWS'],
  [/\b[a-z0-9]{52}\b/, 'posible PAT de Azure DevOps'],
  [/(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*['"][^'"\s]{8,}['"]/i, 'credencial literal']
];
const ignorar = ['devops/scripts/buscar-secretos.js', 'package-lock.json', '.env.example'];
const archivos = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter((a) => a && !ignorar.includes(a));
let hallazgos = 0;
for (const a of archivos) {
  let t;
  try { t = fs.readFileSync(a, 'utf8'); } catch { continue; }
  t.split('\n').forEach((l, i) => {
    for (const [re, nombre] of patrones) {
      if (re.test(l)) { hallazgos++; console.error(`${a}:${i + 1} posible ${nombre}`); }
    }
  });
}
if (hallazgos) { console.error(`Se encontraron ${hallazgos} posibles secretos.`); process.exit(1); }
console.log(`Escaneo de secretos OK (${archivos.length} archivos).`);
