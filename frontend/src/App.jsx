import { useState } from 'react';
import Dashboard from './componentes/Dashboard.jsx';
import DetalleIncidente from './componentes/DetalleIncidente.jsx';
import FormularioIncidente from './componentes/FormularioIncidente.jsx';
import ListaIncidentes from './componentes/ListaIncidentes.jsx';

export default function App() {
  const [vista, setVista] = useState('lista');
  const [seleccion, setSeleccion] = useState(null);
  const [version, setVersion] = useState(0);
  const refrescar = () => setVersion((v) => v + 1);

  return (
    <>
      <header>
        <h1>IT Incident Hub</h1>
        <nav>
          <button className={vista === 'lista' ? 'activo' : ''} onClick={() => { setSeleccion(null); setVista('lista'); }}>Incidentes</button>
          <button className={vista === 'dashboard' ? 'activo' : ''} onClick={() => setVista('dashboard')}>Dashboard</button>
          <button className={vista === 'nuevo' ? 'activo' : ''} onClick={() => setVista('nuevo')}>Nuevo</button>
        </nav>
      </header>
      <main>
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'nuevo' && <FormularioIncidente onCreado={() => { refrescar(); setVista('lista'); }} />}
        {vista === 'lista' && seleccion && (
          <DetalleIncidente id={seleccion} onVolver={() => setSeleccion(null)} onCambio={refrescar} />
        )}
        {vista === 'lista' && !seleccion && <ListaIncidentes version={version} onSeleccionar={setSeleccion} />}
      </main>
    </>
  );
}
