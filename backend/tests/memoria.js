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
    async listar(f = {}, p = {}) {
      const desde = p.desplazamiento || 0;
      return inc
        .filter((i) => ['estado', 'prioridad', 'categoria', 'tecnico'].every((k) => !f[k] || i[k] === f[k]))
        .map((i) => ({ ...i }))
        .reverse()
        .slice(desde, desde + (p.limite || 50));
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
    async actualizar(id, campos) {
      const i = inc.find((x) => x.id === id);
      if (!i) return null;
      Object.assign(i, campos, { actualizado_en: new Date().toISOString() });
      return { ...i };
    },
    async dashboard() {
      const cuenta = (clave) => Object.entries(inc.reduce((a, i) => {
        const k = i[clave] || 'SIN ASIGNAR';
        a[k] = (a[k] || 0) + 1;
        return a;
      }, {})).sort(([a], [b]) => a.localeCompare(b)).map(([nombre, total]) => ({ nombre, total }));
      return {
        abiertos: inc.filter((i) => i.estado !== 'CERRADO').length,
        cerrados: inc.filter((i) => i.estado === 'CERRADO').length,
        criticos: inc.filter((i) => i.prioridad === 'CRITICA' && i.estado !== 'CERRADO').length,
        por_categoria: cuenta('categoria'),
        por_tecnico: cuenta('tecnico')
      };
    },
    // MAS_METODOS
  };
}

module.exports = { crearMemoria };
