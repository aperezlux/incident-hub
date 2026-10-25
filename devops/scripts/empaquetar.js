// Empaqueta backend + frontend compilado + SQL en una carpeta publicable como artefacto.
const fs = require('fs');
const path = require('path');

const destino = process.argv[2] || 'artefacto';
const raiz = process.cwd();
const copiar = (origen, dest) => fs.cpSync(path.join(raiz, origen), path.join(destino, dest), { recursive: true });

fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });
copiar('backend/src', 'backend/src');
copiar('backend/package.json', 'backend/package.json');
copiar('frontend/dist', 'frontend/dist');
copiar('database', 'database');

const version = require(path.join(raiz, 'backend/package.json')).version;
fs.writeFileSync(path.join(destino, 'VERSION.json'), JSON.stringify({
  version,
  build: process.env.BUILD_BUILDNUMBER || 'local',
  commit: process.env.BUILD_SOURCEVERSION || 'local',
  fecha: new Date().toISOString()
}, null, 2));
console.log(`Artefacto v${version} generado en ${destino}`);
