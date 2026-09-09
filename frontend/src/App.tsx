import { useState } from 'react';
import { ResponsiveLayout } from './components/ResponsiveLayout';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Academia } from './components/departamentos/Academia';

import { TestigosIA } from './components/TestigosIA';
import { CerebroOrquestador } from './components/CerebroOrquestador';
import { MonitorDigital } from './components/MonitorDigital';
import { OOHPlanner } from './components/OOHPlanner';
import { InvestmentValue } from './components/InvestmentValue';
import { HubPartners } from './components/HubPartners';
import { CatalogoMaestro } from './components/CatalogoMaestro';
import { Conciliacion } from './components/Conciliacion';
import { TrazabilidadAuditoria } from './components/TrazabilidadAuditoria';
import { CTVSpend } from './components/CTVSpend';
import { Influencers } from './components/Influencers';
import { ToastProvider } from './components/shared/toast';
import { ConfirmProvider } from './components/shared/confirm';
import { RoleProvider } from './components/shared/role';
import { brandingConfig } from './config/branding';
import { secciones } from './config/menu';


import './responsive.css';

function App() {
  const [activeSection, setActiveSection] = useState('verificacion');
  const { colores } = brandingConfig;

  const getTitulo = () =>
    secciones.find(s => s.id === activeSection)?.nombre ?? 'Verificación On-Air';

  const renderContent = () => {
    switch (activeSection) {
      case 'verificacion':  return <TestigosIA />;
      case 'partners':      return <HubPartners />;
      case 'catalogo':      return <CatalogoMaestro />;
      case 'conciliacion':  return <Conciliacion />;
      case 'inversion':     return <InvestmentValue />;
      case 'ingesta':       return <CerebroOrquestador />;
      case 'trazabilidad':  return <TrazabilidadAuditoria />;
      case 'ooh':           return <OOHPlanner />;
      case 'digital':       return <MonitorDigital />;
      case 'ctv':           return <CTVSpend />;
      case 'influencers':   return <Influencers />;
      case 'academia':      return <Academia />;
      default:              return <TestigosIA />;
    }
  };

  return (
    <ToastProvider>
     <ConfirmProvider>
      <RoleProvider>
       <ResponsiveLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        header={<Header title={getTitulo()} onSectionChange={setActiveSection} />}
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
      </RoleProvider>
     </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
