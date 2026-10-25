const { nuevaApp } = require('./ayudas');
const request = require('supertest');
const { createApp } = require('../src/app');

test('un fallo inesperado del repositorio responde 500 sin filtrar detalles', async () => {
  const roto = { listar: async () => { throw new Error('detalle interno'); } };
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const r = await request(createApp(roto)).get('/api/incidentes');
  expect(r.status).toBe(500);
  expect(r.body).toEqual({ error: 'Error interno' });
});

test('los errores de validación mantienen su código', async () => {
  expect((await nuevaApp().get('/api/incidentes/abc')).status).toBe(400);
});
