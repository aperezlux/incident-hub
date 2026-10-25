import { useState } from 'react';
import { api } from '../api.js';
import { CATEGORIAS, PRIORIDADES } from '../constantes.js';

const VACIO = { titulo: '', descripcion: '', categoria: 'SOFTWARE', prioridad: 'MEDIA', usuario: '' };

export default function FormularioIncidente({ onCreado }) {
  const [datos, setDatos] = useState(VACIO);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setError(''); setOk('');
    try {
      const i = await api.crear(datos);
      setOk(`Incidente #${i.id} registrado`);
      setDatos(VACIO);
      if (onCreado) onCreado(i);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="tarjeta" onSubmit={enviar}>
      <h2>Nuevo incidente</h2>
      <div className="fila">
        <label>Título<input name="titulo" value={datos.titulo} onChange={cambiar} /></label>
        <label>Usuario<input name="usuario" value={datos.usuario} onChange={cambiar} /></label>
      </div>
      <div className="fila">
        <label>Categoría
          <select name="categoria" value={datos.categoria} onChange={cambiar}>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Prioridad
          <select name="prioridad" value={datos.prioridad} onChange={cambiar}>
            {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
      </div>
      <label>Descripción<textarea name="descripcion" rows="3" value={datos.descripcion} onChange={cambiar} /></label>
      <p>
        <button className="primario" type="submit">Registrar</button>{' '}
        {error && <span className="error">{error}</span>}
        {ok && <span className="ok">{ok}</span>}
      </p>
    </form>
  );
}
