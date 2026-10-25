// Repositorio en memoria con la misma interfaz que repositorio.js (para pruebas sin BD)
function crearMemoria() {
  const inc = [];
  const com = [];
  let n = 0;
  let k = 0;
  return {
    async crear(d) {
      const ahora = new Date().toISOString();
      const i = { id: ++n, titulo: d.titulo, descripcion: d.descripcion, categoria: d.categoria,
        prioridad: d.prioridad, usuario: d.usuario, tecnico: null, estado: 'NUEVO', creado_en: ahora, actualizado_en: ahora };
      inc.push(i);
      return { ...i };
    },
    async listar(f = {}) {
      return inc
        .filter((i) => ['estado', 'prioridad', 'categoria', 'tecnico'].every((k) => !f[k] || i[k] === f[k]))
        .map((i) => ({ ...i }))
        .reverse();
    },
    async obtener(id) {
      const i = inc.find((x) => x.id === id);
      return i ? { ...i } : null;
    },
    async agregarComentario(incidenteId, autor, texto) {
      const c = { id: ++k, incidente_id: incidenteId, autor, texto, creado_en: new Date().toISOString() };
      com.push(c);
      return { ...c };
    },
    async listarComentarios(incidenteId) {
      return com.filter((c) => c.incidente_id === incidenteId).map((c) => ({ ...c }));
    },
    // MAS_METODOS
  };
}

module.exports = { crearMemoria };
