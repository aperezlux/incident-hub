const { validarIncidente } = require('../dominio');
const { ErrorHttp, asyncHandler, idValido } = require('../errores');

module.exports = (app) => {
  const repo = () => app.locals.repo;

  app.post('/api/incidentes', asyncHandler(async (req, res) => {
    const errores = validarIncidente(req.body);
    if (errores.length) throw new ErrorHttp(400, { errores });
    res.status(201).json(await repo().crear(req.body));
  }));

  app.get('/api/incidentes', asyncHandler(async (req, res) => {
    const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 50, 1), 200);
    const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1);
    res.json(await repo().listar(req.query, { limite, desplazamiento: (pagina - 1) * limite }));
  }));

  app.get('/api/incidentes/:id', asyncHandler(async (req, res) => {
    const i = await repo().obtener(idValido(req.params.id));
    if (!i) throw new ErrorHttp(404, 'No encontrado');
    res.json(i);
  }));
};
