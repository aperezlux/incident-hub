const request = require('supertest');
const { createApp } = require('../src/app');
const { crearMemoria } = require('./memoria');

const valido = {
  titulo: 'Impresora sin tinta', descripcion: 'No imprime', categoria: 'HARDWARE',
  prioridad: 'MEDIA', usuario: 'maria.lopez'
};

function nuevaApp() {
  return request(createApp(crearMemoria()));
}

module.exports = { nuevaApp, valido };
