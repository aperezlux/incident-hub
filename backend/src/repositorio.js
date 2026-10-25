const FILTROS = ['estado', 'prioridad', 'categoria', 'tecnico'];

function crearRepo(pool) {
  return {
    async crear(d) {
      const r = await pool.query(
        'INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, usuario) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [d.titulo.trim(), d.descripcion.trim(), d.categoria, d.prioridad, d.usuario.trim()]
      );
      return r.rows[0];
    },
    async listar(f = {}) {
      const c = [];
      const v = [];
      for (const k of FILTROS) {
        if (f[k]) { v.push(f[k]); c.push(`${k} = $${v.length}`); }
      }
      const w = c.length ? 'WHERE ' + c.join(' AND ') : '';
      const r = await pool.query(`SELECT * FROM incidentes ${w} ORDER BY creado_en DESC, id DESC`, v);
      return r.rows;
    },
    async obtener(id) {
      const r = await pool.query('SELECT * FROM incidentes WHERE id = $1', [id]);
      return r.rows[0] || null;
    },
    async agregarComentario(incidenteId, autor, texto) {
      const r = await pool.query(
        'INSERT INTO comentarios (incidente_id, autor, texto) VALUES ($1,$2,$3) RETURNING *',
        [incidenteId, autor, texto]
      );
      return r.rows[0];
    },
    async listarComentarios(incidenteId) {
      const r = await pool.query('SELECT * FROM comentarios WHERE incidente_id = $1 ORDER BY creado_en ASC, id ASC', [incidenteId]);
      return r.rows;
    },
    // MAS_METODOS
  };
}

module.exports = { crearRepo, FILTROS };
