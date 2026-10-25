const { createApp } = require('./app');
const { crearRepo } = require('./repositorio');
const pool = require('./db');

const port = process.env.PORT || 3000;
createApp(crearRepo(pool)).listen(port, () => console.log(`API escuchando en :${port}`));
