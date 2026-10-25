// Repositorio en memoria con la misma interfaz que repositorio.js (para pruebas sin BD)
function crearMemoria() {
  const inc = [];
  let n = 0;
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
    // MAS_METODOS
  };
}

module.exports = { crearMemoria };
