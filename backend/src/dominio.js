const CATEGORIAS = ['HARDWARE', 'SOFTWARE', 'RED', 'ACCESOS', 'OTROS'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
const ESTADOS = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];
const TRANSICIONES = {
  NUEVO: ['ASIGNADO'],
  ASIGNADO: ['EN_PROCESO'],
  EN_PROCESO: ['RESUELTO'],
  RESUELTO: ['CERRADO', 'EN_PROCESO'],
  CERRADO: []
};

function validarIncidente(d = {}) {
  const e = [];
  if (!d.titulo || d.titulo.trim().length < 5) e.push('titulo: mínimo 5 caracteres');
  if (!d.descripcion || !d.descripcion.trim()) e.push('descripcion: requerida');
  if (!CATEGORIAS.includes(d.categoria)) e.push('categoria inválida');
  if (!PRIORIDADES.includes(d.prioridad)) e.push('prioridad inválida');
  if (!d.usuario || !d.usuario.trim()) e.push('usuario: requerido');
  return e;
}

function transicionValida(de, a) {
  return (TRANSICIONES[de] || []).includes(a);
}

module.exports = { CATEGORIAS, PRIORIDADES, ESTADOS, TRANSICIONES, validarIncidente, transicionValida };
