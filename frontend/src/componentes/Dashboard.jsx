import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { porcentaje } from '../constantes.js';

function Barras({ titulo, datos }) {
  const max = Math.max(1, ...datos.map((d) => d.total));
  return (
    <div className="tarjeta">
      <h3>{titulo}</h3>
      {datos.map((d) => (
        <div key={d.nombre} className="fila" style={{ alignItems: 'center' }}>
          <span style={{ width: 140 }}>{d.nombre}</span>
          <div style={{ flex: 1 }}><div className="barra" style={{ width: `${porcentaje(d.total, max)}%` }} /></div>
          <strong>{d.total}</strong>
        </div>
      ))}
      {!datos.length && <p>Sin datos</p>}
    </div>
  );
}

export default function Dashboard() {
  const [d, setD] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.dashboard().then(setD).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!d) return <p>Cargando…</p>;
  return (
    <section>
      <div className="kpis">
        <div className="tarjeta kpi"><strong>{d.abiertos}</strong>Abiertos</div>
        <div className="tarjeta kpi"><strong>{d.cerrados}</strong>Cerrados</div>
        <div className="tarjeta kpi"><strong>{d.criticos}</strong>Críticos abiertos</div>
      </div>
      <Barras titulo="Por categoría" datos={d.por_categoria} />
      <Barras titulo="Por técnico" datos={d.por_tecnico} />
    </section>
  );
}
