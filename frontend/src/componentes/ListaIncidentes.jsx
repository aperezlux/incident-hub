import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { CATEGORIAS, ESTADOS, PRIORIDADES } from '../constantes.js';

export default function ListaIncidentes({ onSeleccionar, version }) {
  const [filtros, setFiltros] = useState({ estado: '', prioridad: '', categoria: '', tecnico: '' });
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    try {
      setError('');
      setDatos(await api.listar(filtros));
    } catch (err) {
      setError(err.message);
    }
  }, [filtros]);

  useEffect(() => { cargar(); }, [cargar, version]);

  const cambiar = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });
  const selector = (nombre, opciones) => (
    <label>{nombre}
      <select name={nombre.toLowerCase()} value={filtros[nombre.toLowerCase()]} onChange={cambiar}>
        <option value="">Todos</option>
        {opciones.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <section>
      <div className="tarjeta filtros">
        {selector('Estado', ESTADOS)}
        {selector('Prioridad', PRIORIDADES)}
        {selector('Categoria', CATEGORIAS)}
        <label>Tecnico<input name="tecnico" value={filtros.tecnico} onChange={cambiar} placeholder="exacto" /></label>
      </div>
      {error && <p className="error">{error}</p>}
      <table>
        <thead><tr><th>#</th><th>Título</th><th>Categoría</th><th>Prioridad</th><th>Estado</th><th>Técnico</th></tr></thead>
        <tbody>
          {datos.map((i) => (
            <tr key={i.id} className="clic" onClick={() => onSeleccionar && onSeleccionar(i.id)}>
              <td>{i.id}</td><td>{i.titulo}</td><td>{i.categoria}</td>
              <td><span className={`etiqueta ${i.prioridad}`}>{i.prioridad}</span></td>
              <td>{i.estado}</td><td>{i.tecnico || '—'}</td>
            </tr>
          ))}
          {!datos.length && <tr><td colSpan="6">Sin resultados</td></tr>}
        </tbody>
      </table>
    </section>
  );
}
