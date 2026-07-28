import { useState } from 'react';
import { ResponsiveLayout } from './components/ResponsiveLayout';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WarRoom } from './components/WarRoom';
import { AdFraudBrandSafety } from './components/departamentos/AdFraudBrandSafety';
import { StudioCreativo } from './components/departamentos/StudioCreativo';
import { Academia } from './components/departamentos/Academia';

import { TestigosIA } from './components/TestigosIA';
import { CerebroOrquestador } from './components/CerebroOrquestador';
import { MonitorDigital } from './components/MonitorDigital';
import { JourneyIntelligence } from './components/JourneyIntelligence';
import { ComandoCampana } from './components/ComandoCampana';
import { InvestmentValue } from './components/InvestmentValue';
import { AlertasMarca } from './components/AlertasMarca';
import { ToastProvider } from './components/electoral/toast';
import { ConfirmProvider } from './components/electoral/confirm';
import { brandingConfig } from './config/branding';
import { secciones } from './config/menu';


import './responsive.css';

function App() {
  const [activeSection, setActiveSection] = useState('warroom');
  const { colores } = brandingConfig;

  const getTitulo = () =>
    secciones.find(s => s.id === activeSection)?.nombre ?? 'War Room de Cliente';

  const renderContent = () => {
    switch (activeSection) {
      case 'warroom':    return <WarRoom onSectionChange={setActiveSection} />;
      case 'testigos':   return <TestigosIA />;
      case 'cerebro':    return <CerebroOrquestador />;
      case 'comando':    return <ComandoCampana />;
      case 'investment': return <InvestmentValue />;
      case 'alertas':    return <AlertasMarca />;
      case 'digital':    return <MonitorDigital />;
      case 'journey':    return <JourneyIntelligence />;

      case 'adfraud':    return <AdFraudBrandSafety />;
      case 'studio':     return <StudioCreativo />;
      case 'academia':   return <Academia />;
      default:           return <WarRoom onSectionChange={setActiveSection} />;
    }
  };

  return (
    <ToastProvider>
     <ConfirmProvider>
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
     </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;