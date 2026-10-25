const { ErrorHttp, asyncHandler, idValido } = require('../errores');

module.exports = (app) => {
  const repo = () => app.locals.repo;

  app.get('/api/incidentes/:id/comentarios', asyncHandler(async (req, res) => {
    const id = idValido(req.params.id);
    if (!(await repo().obtener(id))) throw new ErrorHttp(404, 'No encontrado');
    res.json(await repo().listarComentarios(id));
  }));

  app.post('/api/incidentes/:id/comentarios', asyncHandler(async (req, res) => {
    const id = idValido(req.params.id);
    const { autor, texto } = req.body || {};
    if (!autor || !autor.trim() || !texto || !texto.trim()) {
      throw new ErrorHttp(400, { errores: ['autor y texto son requeridos'] });
    }
    if (!(await repo().obtener(id))) throw new ErrorHttp(404, 'No encontrado');
    res.status(201).json(await repo().agregarComentario(id, autor.trim(), texto.trim()));
  }));
};
