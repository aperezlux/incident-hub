const { nuevaApp, valido } = require('./ayudas');

test('dashboard calcula abiertos, cerrados, críticos y distribuciones', async () => {
  const app = nuevaApp();
  await app.post('/api/incidentes').send(valido);
  await app.post('/api/incidentes').send({ ...valido, prioridad: 'CRITICA', categoria: 'RED' });
  await app.patch('/api/incidentes/2/asignar').send({ tecnico: 'tecnico.diaz' });
  const r = await app.get('/api/dashboard');
  expect(r.status).toBe(200);
  expect(r.body).toMatchObject({ abiertos: 2, cerrados: 0, criticos: 1 });
  expect(r.body.por_categoria).toEqual([{ nombre: 'HARDWARE', total: 1 }, { nombre: 'RED', total: 1 }]);
  expect(r.body.por_tecnico).toEqual([{ nombre: 'SIN ASIGNAR', total: 1 }, { nombre: 'tecnico.diaz', total: 1 }]);
});
