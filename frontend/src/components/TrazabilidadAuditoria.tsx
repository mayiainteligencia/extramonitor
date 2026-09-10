import React, { useState } from 'react';
import { ShieldCheck, Download, FileCheck2, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Panel, Kpi, Insight, SectionHero, EmptyState, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { CIFRAS } from '../data/trazabilidad';

const { colores } = brandingConfig;
const V = colores.primario;

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

  const versiones = Array.from(new Set(CIFRAS.map(c => c.versionCorta)));
  const porVersion = versiones.map(v => ({ version: v, cifras: CIFRAS.filter(c => c.versionCorta === v).length }));

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Trazabilidad y Auditoría"
          estado="en-activacion"
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
            <Insight kind="Análisis" title={`${CIFRAS.length} cifras con linaje completo en esta vista`}>
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
          <Kpi label="Versiones de metodología en uso" value={String(versiones.length)} />
        </div>

        <Panel title="Cifras publicadas por versión de metodología" icon={<BarChart3 size={17} color={V} />} style={{ marginBottom: 22 }}>
          {porVersion.length === 0 ? (
            <EmptyState mensaje="Aún no hay cifras publicadas." />
          ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={porVersion} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
              <XAxis dataKey="version" tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v} cifras`, 'Publicadas']} />
              <Bar dataKey="cifras" fill={V} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Cifras y su linaje" icon={<ShieldCheck size={17} color={V} />}>
          {CIFRAS.length === 0 ? (
            <EmptyState mensaje="Aún no hay cifras con linaje registrado." />
          ) : (
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
          )}
        </Panel>
      </div>
    </div>
  );
};
