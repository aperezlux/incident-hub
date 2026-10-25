import { useState } from 'react';
import FormularioIncidente from './componentes/FormularioIncidente.jsx';
import ListaIncidentes from './componentes/ListaIncidentes.jsx';

export default function App() {
  const [vista, setVista] = useState('lista');
  const [version, setVersion] = useState(0);

  return (
    <>
      <header>
        <h1>IT Incident Hub</h1>
        <nav>
          <button className={vista === 'lista' ? 'activo' : ''} onClick={() => setVista('lista')}>Incidentes</button>
          <button className={vista === 'nuevo' ? 'activo' : ''} onClick={() => setVista('nuevo')}>Nuevo</button>
        </nav>
      </header>
      <main>
        {vista === 'nuevo' && <FormularioIncidente onCreado={() => { setVersion(version + 1); setVista('lista'); }} />}
        {vista === 'lista' && <ListaIncidentes version={version} />}
      </main>
    </>
  );
}
