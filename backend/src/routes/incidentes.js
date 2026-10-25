const { validarIncidente } = require('../dominio');

module.exports = (app) => {
  const repo = () => app.locals.repo;

  app.post('/api/incidentes', async (req, res) => {
    try {
      const errores = validarIncidente(req.body);
      if (errores.length) return res.status(400).json({ errores });
      const i = await repo().crear(req.body);
      return res.status(201).json(i);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  });

  app.get('/api/incidentes', async (req, res) => {
    try {
      return res.json(await repo().listar(req.query));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  });

  app.get('/api/incidentes/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: 'id inválido' });
      const i = await repo().obtener(id);
      return i ? res.json(i) : res.status(404).json({ error: 'No encontrado' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  });
};
