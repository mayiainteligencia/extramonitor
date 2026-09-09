import React, { useState } from 'react';
import { ShieldCheck, Download, FileCheck2 } from 'lucide-react';
import { Panel, Kpi, Insight, SectionHero, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { ULTIMO, fmtMXNCorto, porPeriodo } from '../data/media';

const { colores } = brandingConfig;
const V = colores.primario;

interface CifraTrazada {
  cifra: string;
  valor: string;
  origen: string;
  proveedor: string;
  timestamp: string;
  metodologia: string;
  impugnable: boolean;
}

const D = porPeriodo[ULTIMO];

// Dato simulado — la forma es real: toda cifra debe poder responder de qué
// proveedor viene, con qué timestamp, bajo qué metodología, y quién la impugna.
const CIFRAS: CifraTrazada[] = [
  { cifra: 'Inversión total de industria', valor: fmtMXNCorto(D.inversionTotal), origen: 'Motor de Ingesta · etapa Cruce de Entregas', proveedor: 'HR Media', timestamp: `${ULTIMO}-12-01 06:40`, metodologia: 'v3.2 (vigente desde 2025-06)', impugnable: true },
  { cifra: 'GRPs de industria', valor: `${D.grpsTotal.toLocaleString('es-MX')}`, origen: 'Motor de Ingesta · etapa Cruce de Entregas', proveedor: 'HR Media', timestamp: `${ULTIMO}-12-01 06:40`, metodologia: 'v3.2 (vigente desde 2025-06)', impugnable: true },
  { cifra: 'Alcance promedio', valor: `${D.alcanceProm}%`, origen: 'Modelo de Mix de Medios', proveedor: 'HR Media', timestamp: `${ULTIMO}-12-01 07:10`, metodologia: 'v3.2 (vigente desde 2025-06)', impugnable: true },
  { cifra: 'Score de oportunidad OOH (promedio)', valor: 'ver Censo OOH', origen: 'Modelo de Oportunidad OOH', proveedor: 'Datalab ACAM (interno)', timestamp: `${ULTIMO}-12-01 05:20`, metodologia: 'v1.0 (beta)', impugnable: false },
  { cifra: 'Caso CC-101 · delta de spots', valor: '6 spots', origen: 'Verificación On-Air', proveedor: 'Monitoreo propio ACAM', timestamp: `${ULTIMO}-12-02 08:15`, metodologia: 'Transcripción Whisper + cruce de pauta', impugnable: true },
];

export const TrazabilidadAuditoria: React.FC = () => {
  const isMobile = useIsMobile();
  const { push } = useToast();
  const [exportando, setExportando] = useState(false);

  const exportarPaquete = () => {
    setExportando(true);
    // ponytail: mock del export; el flujo real generaría el ZIP con las
    // cifras + su linaje en el formato que ya reconocen 3m3a y RSMB.
    setTimeout(() => {
      setExportando(false);
      push({ kind: 'success', title: 'Paquete de auditoría generado', msg: 'Formato compatible con 3m3a y RSMB. Descarga simulada — sin archivo real en esta demo.' });
    }, 1200);
  };

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Trazabilidad y Auditoría"
          title={<>Linaje de <strong style={{ fontWeight: 800 }}>Cada Cifra</strong></>}
          subtitle="Toda cifra mostrada en la plataforma debe responder: ¿de qué proveedor viene, con qué timestamp, bajo qué versión de metodología, y quién la puede impugnar? Dato simulado."
          right={
            <button onClick={exportarPaquete} disabled={exportando} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', cursor: exportando ? 'default' : 'pointer',
              background: '#fff', color: colores.textoClaro, padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              opacity: exportando ? 0.7 : 1,
            }}>
              <Download size={15} /> {exportando ? 'Generando…' : 'Exportar paquete de auditoría'}
            </button>
          }
          insights={<>
            <Insight kind="Análisis" title="5 cifras con linaje completo en esta vista">
              Cada una lleva su proveedor, timestamp y versión de metodología — la base para que un auditor externo (3m3a, RSMB) las reproduzca sin pedir contexto adicional.
            </Insight>
            <Insight kind="Sugerencia" title="El Score OOH aún no es impugnable">
              Es un modelo interno del datalab de ACAM, no una cifra de proveedor: no aplica el mismo mecanismo de impugnación que las demás.
            </Insight>
          </>}
        />

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
          <Kpi label="Cifras con linaje" value={String(CIFRAS.length)} />
          <Kpi label="Impugnables" value={String(CIFRAS.filter(c => c.impugnable).length)} sub="con proveedor externo" />
          <Kpi label="Versión de metodología vigente" value="v3.2" sub="desde 2025-06" />
        </div>

        <Panel title="Cifras y su linaje" icon={<ShieldCheck size={17} color={V} />}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 760 }}>
              <thead>
                <tr>
                  {['Cifra', 'Valor', 'Origen', 'Proveedor', 'Timestamp', 'Metodología', 'Impugnable'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 12px', color: colores.textoOscuro,
                      fontWeight: 700, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.04em',
                      borderBottom: `1px solid ${colores.borde}`, whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CIFRAS.map(c => (
                  <tr key={c.cifra}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: colores.textoClaro, borderBottom: `1px solid ${colores.borde}` }}>{c.cifra}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoClaro, fontVariantNumeric: 'tabular-nums', borderBottom: `1px solid ${colores.borde}` }}>{c.valor}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoMedio, borderBottom: `1px solid ${colores.borde}` }}>{c.origen}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoMedio, borderBottom: `1px solid ${colores.borde}` }}>{c.proveedor}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoOscuro, whiteSpace: 'nowrap', borderBottom: `1px solid ${colores.borde}` }}>{c.timestamp}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoOscuro, borderBottom: `1px solid ${colores.borde}` }}>{c.metodologia}</td>
                    <td style={{ padding: '10px 12px', borderBottom: `1px solid ${colores.borde}` }}>
                      {c.impugnable
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: colores.exito, fontWeight: 700 }}><FileCheck2 size={12} /> Sí</span>
                        : <span style={{ fontSize: 11, color: colores.textoOscuro }}>No aplica</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
};
