module.exports = (app) => {
  const repo = () => app.locals.repo;

  app.get('/api/incidentes/:id/comentarios', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });
      if (!(await repo().obtener(id))) return res.status(404).json({ error: 'No encontrado' });
      return res.json(await repo().listarComentarios(id));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  });

  app.post('/api/incidentes/:id/comentarios', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });
      const { autor, texto } = req.body || {};
      if (!autor || !autor.trim() || !texto || !texto.trim()) {
        return res.status(400).json({ errores: ['autor y texto son requeridos'] });
      }
      if (!(await repo().obtener(id))) return res.status(404).json({ error: 'No encontrado' });
      return res.status(201).json(await repo().agregarComentario(id, autor.trim(), texto.trim()));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  });
};
