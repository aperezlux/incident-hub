const { ESTADOS, transicionValida } = require('../dominio');
const { ErrorHttp, asyncHandler, idValido } = require('../errores');

module.exports = (app) => {
  const repo = () => app.locals.repo;

  async function cargar(req) {
    const i = await repo().obtener(idValido(req.params.id));
    if (!i) throw new ErrorHttp(404, 'No encontrado');
    return i;
  }

  app.patch('/api/incidentes/:id/asignar', asyncHandler(async (req, res) => {
    const i = await cargar(req);
    const tecnico = ((req.body && req.body.tecnico) || '').trim();
    if (!tecnico) throw new ErrorHttp(400, { errores: ['tecnico: requerido'] });
    if (!['NUEVO', 'ASIGNADO'].includes(i.estado)) {
      throw new ErrorHttp(409, `No se puede asignar un incidente en estado ${i.estado}`);
    }
    const act = await repo().actualizar(i.id, { tecnico, estado: 'ASIGNADO' });
    await repo().agregarComentario(i.id, 'sistema', `Asignado a ${tecnico}`);
    res.json(act);
  }));

  app.patch('/api/incidentes/:id/estado', asyncHandler(async (req, res) => {
    const i = await cargar(req);
    const nuevo = req.body && req.body.estado;
    if (!ESTADOS.includes(nuevo)) throw new ErrorHttp(400, { errores: ['estado inválido'] });
    if (nuevo === 'ASIGNADO') throw new ErrorHttp(409, 'Use /asignar para asignar un técnico');
    if (!transicionValida(i.estado, nuevo)) throw new ErrorHttp(409, `Transición no permitida: ${i.estado} → ${nuevo}`);
    const act = await repo().actualizar(i.id, { estado: nuevo });
    await repo().agregarComentario(i.id, 'sistema', `Estado: ${i.estado} → ${nuevo}`);
    res.json(act);
  }));
};
