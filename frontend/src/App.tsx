import { useState } from 'react';
import { ResponsiveLayout } from './components/ResponsiveLayout';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EnConstruccion } from './components/shared/EnConstruccion';
import { DashboardGeneral } from './components/DashboardGeneral';
import { Clientes } from './components/Clientes';
import { Servicios } from './components/Servicios';
import { RutasFlota } from './components/RutasFlota';
import { OperacionVivo } from './components/OperacionVivo';
import { OficialesSeguridad } from './components/OficialesSeguridad';
import { CustodiaValores } from './components/CustodiaValores';
import { MonitoreoAlarmas } from './components/MonitoreoAlarmas';
import { TransporteMercancias } from './components/TransporteMercancias';
import { Incidencias } from './components/Incidencias';
import { AnaliticaSLA } from './components/AnaliticaSLA';
import { Facturacion } from './components/Facturacion';
import { PortalCliente } from './components/PortalCliente';
import { UsuariosAuditoria } from './components/UsuariosAuditoria';
import { ToastProvider } from './components/shared/toast';
import { ConfirmProvider } from './components/shared/confirm';
import { brandingConfig } from './config/branding';
import { secciones } from './config/menu';

import './responsive.css';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { colores } = brandingConfig;

  const seccionActiva = () =>
    secciones.find(s => s.id === activeSection) ?? secciones[0];

  const renderContent = () => {
    if (activeSection === 'dashboard') return <DashboardGeneral onSectionChange={setActiveSection} />;
    if (activeSection === 'clientes') return <Clientes />;
    if (activeSection === 'servicios') return <Servicios />;
    if (activeSection === 'rutas') return <RutasFlota />;
    if (activeSection === 'operacion') return <OperacionVivo />;
    if (activeSection === 'seguridad') return <OficialesSeguridad />;
    if (activeSection === 'custodia') return <CustodiaValores />;
    if (activeSection === 'alarmas') return <MonitoreoAlarmas />;
    if (activeSection === 'transporte') return <TransporteMercancias />;
    if (activeSection === 'incidencias') return <Incidencias />;
    if (activeSection === 'analitica') return <AnaliticaSLA />;
    if (activeSection === 'facturacion') return <Facturacion />;
    if (activeSection === 'portal') return <PortalCliente />;
    if (activeSection === 'usuarios') return <UsuariosAuditoria />;
    const seccion = seccionActiva();
    return <EnConstruccion titulo={seccion.nombre} descripcion={seccion.descripcion} />;
  };

  return (
    <ToastProvider>
     <ConfirmProvider>
      <ResponsiveLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        header={<Header title={seccionActiva().nombre} onSectionChange={setActiveSection} />}
        sidebar={
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        }
      >
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: colores.fondoPrincipal }}>
          {renderContent()}
        </div>
      </ResponsiveLayout>
     </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
