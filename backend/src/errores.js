class ErrorHttp extends Error {
  constructor(estado, cuerpo) {
    super(typeof cuerpo === 'string' ? cuerpo : 'Error HTTP');
    this.estado = estado;
    this.cuerpo = typeof cuerpo === 'string' ? { error: cuerpo } : cuerpo;
  }
}

// Envuelve un handler async para delegar excepciones al middleware de errores
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function idValido(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id)) throw new ErrorHttp(400, 'id inválido');
  return id;
}

// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, _req, res, _next) {
  if (err instanceof ErrorHttp) return res.status(err.estado).json(err.cuerpo);
  console.error(err);
  return res.status(500).json({ error: 'Error interno' });
}

module.exports = { ErrorHttp, asyncHandler, idValido, manejadorErrores };
