module.exports = (app) => {
  app.get('/api/dashboard', async (_req, res) => {
    try {
      return res.json(await app.locals.repo.dashboard());
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error interno' });
    }
  });
};
