// Verifica coherencia de versión: backend == frontend y existe entrada en CHANGELOG.md
const fs = require('fs');
const be = JSON.parse(fs.readFileSync('backend/package.json', 'utf8')).version;
const fe = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8')).version;
const log = fs.readFileSync('CHANGELOG.md', 'utf8');
const semver = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;
const errores = [];
if (be !== fe) errores.push(`Versiones distintas: backend ${be} / frontend ${fe}`);
if (!semver.test(be)) errores.push(`La versión ${be} no es SemVer`);
if (!log.includes(`## [${be}]`)) errores.push(`CHANGELOG.md no tiene entrada para ${be}`);
if (errores.length) { console.error(errores.join('\n')); process.exit(1); }
console.log(`Versión ${be} coherente`);
