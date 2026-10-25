import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { estadosSiguientes } from '../constantes.js';

export default function DetalleIncidente({ id, onVolver, onCambio }) {
  const [inc, setInc] = useState(null);
  const [bitacora, setBitacora] = useState([]);
  const [tecnico, setTecnico] = useState('');
  const [autor, setAutor] = useState('');
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    try {
      setInc(await api.obtener(id));
      setBitacora(await api.comentarios(id));
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => { cargar(); }, [cargar]);

  async function ejecutar(accion) {
    try {
      setError('');
      await accion();
      await cargar();
      if (onCambio) onCambio();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!inc) return <p>{error || 'Cargando…'}</p>;
  const siguientes = estadosSiguientes(inc.estado);
  const puedeAsignar = ['NUEVO', 'ASIGNADO'].includes(inc.estado);

  return (
    <section>
      <button onClick={onVolver}>← Volver</button>
      <div className="tarjeta">
        <h2>#{inc.id} {inc.titulo}</h2>
        <p>{inc.descripcion}</p>
        <p>
          <span className={`etiqueta ${inc.prioridad}`}>{inc.prioridad}</span>{' '}
          <span className="etiqueta">{inc.categoria}</span>{' '}
          <span className="etiqueta">{inc.estado}</span> · Reportó: {inc.usuario} · Técnico: {inc.tecnico || '—'}
        </p>
        {error && <p className="error">{error}</p>}
        {puedeAsignar && (
          <div className="fila">
            <input placeholder="Técnico" value={tecnico} onChange={(e) => setTecnico(e.target.value)} />
            <button className="primario" onClick={() => ejecutar(() => api.asignar(id, tecnico))}>Asignar</button>
          </div>
        )}
        {siguientes.map((s) => (
          <button key={s} onClick={() => ejecutar(() => api.cambiarEstado(id, s))}>Pasar a {s}</button>
        ))}
      </div>
      <div className="tarjeta">
        <h3>Bitácora</h3>
        <ul className="bitacora">
          {bitacora.map((c) => (
            <li key={c.id}><strong>{c.autor}</strong>: {c.texto} <small>{new Date(c.creado_en).toLocaleString()}</small></li>
          ))}
          {!bitacora.length && <li>Sin comentarios</li>}
        </ul>
        <div className="fila">
          <input placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
          <input placeholder="Comentario" value={texto} onChange={(e) => setTexto(e.target.value)} style={{ flex: 3 }} />
          <button className="primario" onClick={() => ejecutar(async () => { await api.comentar(id, autor, texto); setTexto(''); })}>Agregar</button>
        </div>
      </div>
    </section>
  );
}
