// Despliegue simulado: publica el artefacto en una carpeta por ambiente, valida (smoke) y permite rollback.
// Uso: node desplegar.js <carpeta_artefacto> <ambiente>   |   node desplegar.js --rollback <ambiente>
const fs = require('fs');
const os = require('os');
const path = require('path');

const raiz = process.env.DEPLOY_ROOT || path.join(os.homedir(), 'incident-hub-despliegues');

function rollback(amb) {
  const actual = path.join(raiz, amb);
  const previo = path.join(raiz, `${amb}-anterior`);
  if (!fs.existsSync(previo)) throw new Error(`No hay versión anterior para ${amb}`);
  fs.rmSync(actual, { recursive: true, force: true });
  fs.renameSync(previo, actual);
  console.log(`Rollback de ${amb} completado`);
}

function smoke(dir) {
  const requeridos = ['VERSION.json', 'backend/src/server.js', 'backend/package.json', 'frontend/dist/index.html', 'database'];
  const faltan = requeridos.filter((r) => !fs.existsSync(path.join(dir, r)));
  if (faltan.length) throw new Error(`Validación fallida, faltan: ${faltan.join(', ')}`);
  return JSON.parse(fs.readFileSync(path.join(dir, 'VERSION.json'), 'utf8'));
}

function desplegar(origen, amb) {
  const destino = path.join(raiz, amb);
  const previo = path.join(raiz, `${amb}-anterior`);
  fs.mkdirSync(raiz, { recursive: true });
  fs.rmSync(previo, { recursive: true, force: true });
  if (fs.existsSync(destino)) fs.renameSync(destino, previo);
  fs.cpSync(origen, destino, { recursive: true });
  try {
    const v = smoke(destino);
    fs.writeFileSync(path.join(destino, 'release.json'), JSON.stringify({ ambiente: amb, ...v, desplegado: new Date().toISOString() }, null, 2));
    console.log(`Desplegado v${v.version} (build ${v.build}) en ${amb}: ${destino}`);
  } catch (e) {
    console.error(e.message);
    if (fs.existsSync(previo)) rollback(amb);
    process.exit(1);
  }
}

const [a, b] = process.argv.slice(2);
if (a === '--rollback') rollback(b);
else if (a && b) desplegar(path.resolve(a), b);
else { console.error('Uso: desplegar.js <artefacto> <ambiente> | --rollback <ambiente>'); process.exit(2); }
