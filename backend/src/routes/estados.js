const { ESTADOS, transicionValida } = require('../dominio');

module.exports = (app) => {
  const repo = () => app.locals.repo;

  async function cargar(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) { res.status(400).json({ error: 'id inválido' }); return null; }
    const i = await repo().obtener(id);
    if (!i) { res.status(404).json({ error: 'No encontrado' }); return null; }
    return i;
  }

  app.patch('/api/incidentes/:id/asignar', async (req, res) => {
    try {
      const i = await cargar(req, res);
      if (!i) return undefined;
      const tecnico = (req.body && req.body.tecnico || '').trim();
      if (!tecnico) return res.status(400).json({ errores: ['tecnico: requerido'] });
      if (!['NUEVO', 'ASIGNADO'].includes(i.estado)) {
        return res.status(409).json({ error: `No se puede asignar un incidente en estado ${i.estado}` });
      }
      const act = await repo().actualizar(i.id, { tecnico, estado: 'ASIGNADO' });
      await repo().agregarComentario(i.id, 'sistema', `Asignado a ${tecnico}`);
      return res.json(act);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  });

  app.patch('/api/incidentes/:id/estado', async (req, res) => {
    try {
      const i = await cargar(req, res);
      if (!i) return undefined;
      const nuevo = req.body && req.body.estado;
      if (!ESTADOS.includes(nuevo)) return res.status(400).json({ errores: ['estado inválido'] });
      if (nuevo === 'ASIGNADO') return res.status(409).json({ error: 'Use /asignar para asignar un técnico' });
      if (!transicionValida(i.estado, nuevo)) {
        return res.status(409).json({ error: `Transición no permitida: ${i.estado} → ${nuevo}` });
      }
      const act = await repo().actualizar(i.id, { estado: nuevo });
      await repo().agregarComentario(i.id, 'sistema', `Estado: ${i.estado} → ${nuevo}`);
      return res.json(act);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  });
};
