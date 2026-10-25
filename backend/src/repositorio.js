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
    async actualizar(id, campos) {
      const sets = [];
      const v = [];
      for (const k of ['estado', 'tecnico']) {
        if (campos[k] !== undefined) { v.push(campos[k]); sets.push(`${k} = $${v.length}`); }
      }
      v.push(id);
      const r = await pool.query(
        `UPDATE incidentes SET ${sets.join(', ')}, actualizado_en = now() WHERE id = $${v.length} RETURNING *`, v
      );
      return r.rows[0] || null;
    },
    async dashboard() {
      const t = await pool.query(
        `SELECT COUNT(*) FILTER (WHERE estado <> 'CERRADO')::int AS abiertos,
                COUNT(*) FILTER (WHERE estado = 'CERRADO')::int AS cerrados,
                COUNT(*) FILTER (WHERE prioridad = 'CRITICA' AND estado <> 'CERRADO')::int AS criticos
           FROM incidentes`
      );
      const cat = await pool.query('SELECT categoria AS nombre, COUNT(*)::int AS total FROM incidentes GROUP BY categoria ORDER BY categoria');
      const tec = await pool.query("SELECT COALESCE(tecnico, 'SIN ASIGNAR') AS nombre, COUNT(*)::int AS total FROM incidentes GROUP BY 1 ORDER BY 1");
      return { ...t.rows[0], por_categoria: cat.rows, por_tecnico: tec.rows };
    },
    // MAS_METODOS
  };
}

module.exports = { crearRepo, FILTROS };
