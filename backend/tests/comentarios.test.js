const { nuevaApp, valido } = require('./ayudas');

describe('API de comentarios', () => {
  test('agrega y lista comentarios en orden', async () => {
    const app = nuevaApp();
    await app.post('/api/incidentes').send(valido);
    const c = await app.post('/api/incidentes/1/comentarios').send({ autor: 'tecnico.ruiz', texto: 'Revisando' });
    expect(c.status).toBe(201);
    await app.post('/api/incidentes/1/comentarios').send({ autor: 'tecnico.ruiz', texto: 'Resuelto' });
    const l = await app.get('/api/incidentes/1/comentarios');
    expect(l.body.map((x) => x.texto)).toEqual(['Revisando', 'Resuelto']);
  });
  test('valida entrada y existencia del incidente', async () => {
    const app = nuevaApp();
    expect((await app.post('/api/incidentes/1/comentarios').send({ autor: 'a', texto: 'b' })).status).toBe(404);
    await app.post('/api/incidentes').send(valido);
    expect((await app.post('/api/incidentes/1/comentarios').send({ autor: '' })).status).toBe(400);
  });
});
