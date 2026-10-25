const { nuevaApp, valido } = require('./ayudas');

describe('API de incidentes', () => {
  test('crea un incidente (201) en estado NUEVO', async () => {
    const r = await nuevaApp().post('/api/incidentes').send(valido);
    expect(r.status).toBe(201);
    expect(r.body.estado).toBe('NUEVO');
  });
  test('rechaza datos inválidos (400)', async () => {
    const r = await nuevaApp().post('/api/incidentes').send({ titulo: 'x' });
    expect(r.status).toBe(400);
    expect(r.body.errores.length).toBeGreaterThan(0);
  });
  test('lista y filtra por prioridad y categoría', async () => {
    const app = nuevaApp();
    await app.post('/api/incidentes').send(valido);
    await app.post('/api/incidentes').send({ ...valido, prioridad: 'CRITICA', categoria: 'RED' });
    expect((await app.get('/api/incidentes')).body.length).toBe(2);
    expect((await app.get('/api/incidentes?prioridad=CRITICA')).body.length).toBe(1);
    expect((await app.get('/api/incidentes?categoria=HARDWARE')).body.length).toBe(1);
  });
  test('consulta por id, 404 y 400', async () => {
    const app = nuevaApp();
    await app.post('/api/incidentes').send(valido);
    expect((await app.get('/api/incidentes/1')).status).toBe(200);
    expect((await app.get('/api/incidentes/99')).status).toBe(404);
    expect((await app.get('/api/incidentes/abc')).status).toBe(400);
  });
});

describe('paginación', () => {
  test('respeta limite y pagina', async () => {
    const app = nuevaApp();
    for (let i = 0; i < 5; i++) await app.post('/api/incidentes').send({ ...valido, titulo: `Incidente número ${i}` });
    const p1 = await app.get('/api/incidentes?limite=2&pagina=1');
    const p3 = await app.get('/api/incidentes?limite=2&pagina=3');
    expect(p1.body.length).toBe(2);
    expect(p3.body.length).toBe(1);
    expect(p1.body[0].titulo).toBe('Incidente número 4');
  });
  test('acota el límite máximo a 200 y el mínimo a 1', async () => {
    const app = nuevaApp();
    await app.post('/api/incidentes').send(valido);
    expect((await app.get('/api/incidentes?limite=0')).body.length).toBe(1);
    expect((await app.get('/api/incidentes?limite=9999')).status).toBe(200);
  });
});
