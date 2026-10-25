const { asyncHandler } = require('../errores');

module.exports = (app) => {
  app.get('/api/dashboard', asyncHandler(async (_req, res) => {
    res.json(await app.locals.repo.dashboard());
  }));
};
