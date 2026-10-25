const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { manejadorErrores } = require('./errores');

function createApp(repo) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.locals.repo = repo;
  app.get('/health', (_req, res) => res.json({ estado: 'ok' }));
  const dir = path.join(__dirname, 'routes');
  fs.readdirSync(dir)
    .filter((f) => f.endsWith('.js'))
    .sort()
    .forEach((f) => require(path.join(dir, f))(app));
  app.use(manejadorErrores);
  return app;
}

module.exports = { createApp };
