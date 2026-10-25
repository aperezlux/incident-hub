async function pedir(url, opciones = {}) {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opciones });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d.errores && d.errores.join(', ')) || d.error || 'Error de red');
  return d;
}

const enviar = (metodo, cuerpo) => ({ method: metodo, body: JSON.stringify(cuerpo) });

export const api = {
  listar: (filtros = {}) => {
    const q = new URLSearchParams(Object.entries(filtros).filter(([, v]) => v));
    return pedir(`/api/incidentes?${q}`);
  },
  crear: (d) => pedir('/api/incidentes', enviar('POST', d)),
  obtener: (id) => pedir(`/api/incidentes/${id}`),
  asignar: (id, tecnico) => pedir(`/api/incidentes/${id}/asignar`, enviar('PATCH', { tecnico })),
  cambiarEstado: (id, estado) => pedir(`/api/incidentes/${id}/estado`, enviar('PATCH', { estado })),
  comentarios: (id) => pedir(`/api/incidentes/${id}/comentarios`),
  comentar: (id, autor, texto) => pedir(`/api/incidentes/${id}/comentarios`, enviar('POST', { autor, texto })),
  dashboard: () => pedir('/api/dashboard')
};
