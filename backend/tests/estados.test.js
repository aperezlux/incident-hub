const { nuevaApp, valido } = require('./ayudas');

async function conIncidente() {
  const app = nuevaApp();
  await app.post('/api/incidentes').send(valido);
  return app;
}

describe('asignación y estados', () => {
  test('recorre el flujo completo NUEVO → CERRADO con bitácora automática', async () => {
    const app = await conIncidente();
    expect((await app.patch('/api/incidentes/1/asignar').send({ tecnico: 'tecnico.ruiz' })).body.estado).toBe('ASIGNADO');
    for (const e of ['EN_PROCESO', 'RESUELTO', 'CERRADO']) {
      const r = await app.patch('/api/incidentes/1/estado').send({ estado: e });
      expect(r.status).toBe(200);
      expect(r.body.estado).toBe(e);
    }
    const bit = await app.get('/api/incidentes/1/comentarios');
    expect(bit.body.length).toBe(4);
  });
  test('rechaza transiciones inválidas con 409', async () => {
    const app = await conIncidente();
    const r = await app.patch('/api/incidentes/1/estado').send({ estado: 'CERRADO' });
    expect(r.status).toBe(409);
  });
  test('valida técnico y estado', async () => {
    const app = await conIncidente();
    expect((await app.patch('/api/incidentes/1/asignar').send({})).status).toBe(400);
    expect((await app.patch('/api/incidentes/1/estado').send({ estado: 'X' })).status).toBe(400);
    expect((await app.patch('/api/incidentes/9/asignar').send({ tecnico: 't' })).status).toBe(404);
  });
  test('un incidente cerrado no admite más cambios', async () => {
    const app = await conIncidente();
    await app.patch('/api/incidentes/1/asignar').send({ tecnico: 't' });
    for (const e of ['EN_PROCESO', 'RESUELTO', 'CERRADO']) await app.patch('/api/incidentes/1/estado').send({ estado: e });
    expect((await app.patch('/api/incidentes/1/estado').send({ estado: 'EN_PROCESO' })).status).toBe(409);
    expect((await app.patch('/api/incidentes/1/asignar').send({ tecnico: 'otro' })).status).toBe(409);
  });
});
