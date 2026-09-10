import React from 'react';
import { Users2, TrendingUp } from 'lucide-react';
import { Panel, Kpi, Insight, SectionHero, EmptyState, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { fmtMXN } from '../data/media';

const { colores } = brandingConfig;
const V = colores.primario;

interface Influencer {
  nombre: string;
  categoria: string;
  seguidores: string;
  engagementPct: number;
  spendEstimadoMXN: number;
  impactoEstimado: string;
}

// Dato simulado — hueco que hoy nadie mide con método formal en México.
const INFLUENCERS: Influencer[] = [
  { nombre: '@creador.tech',     categoria: 'Tecnología', seguidores: '1.2M', engagementPct: 4.8, spendEstimadoMXN: 850_000, impactoEstimado: '3.1M impresiones' },
  { nombre: '@vida.finanzas',    categoria: 'Finanzas personales', seguidores: '640K', engagementPct: 6.1, spendEstimadoMXN: 420_000, impactoEstimado: '1.8M impresiones' },
  { nombre: '@moda.mx',          categoria: 'Moda / retail', seguidores: '2.1M', engagementPct: 3.4, spendEstimadoMXN: 1_100_000, impactoEstimado: '5.4M impresiones' },
  { nombre: '@auto.review.mx',   categoria: 'Automotriz', seguidores: '380K', engagementPct: 5.2, spendEstimadoMXN: 310_000, impactoEstimado: '1.1M impresiones' },
];

export const Influencers: React.FC = () => {
  const isMobile = useIsMobile();
  const spendTotal = INFLUENCERS.reduce((s, i) => s + i.spendEstimadoMXN, 0);

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Influencers"
          estado="en-activacion"
          title={<>Medición de <strong style={{ fontWeight: 800 }}>Creadores</strong></>}
          subtitle="Spend e impacto estimado en influencers: un hueco que hoy nadie mide con método formal en México y que no compite con la licitación de monitoreo de ACAM. Dato simulado."
          insights={<>
            <Insight kind="Análisis" title="Sin estándar de medición hoy">
              A diferencia de TV, Radio y OOH, no existe metodología común entre proveedores para reportar spend en influencers — cada agencia mide distinto.
            </Insight>
            <Insight kind="Sugerencia" title="Empezar por engagement, no por seguidores">
              Los seguidores son fáciles de inflar; el engagement cruzado con audiencia real es el dato que un comité técnico puede auditar.
            </Insight>
          </>}
        />

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
          <Kpi label="Spend estimado" value={fmtMXN(spendTotal)} sub="dato simulado" />
          <Kpi label="Creadores monitoreados" value={String(INFLUENCERS.length)} />
          <Kpi label="Engagement promedio" value={`${(INFLUENCERS.reduce((s, i) => s + i.engagementPct, 0) / INFLUENCERS.length).toFixed(1)}%`} up />
        </div>

        <Panel title="Creadores monitoreados" icon={<Users2 size={17} color={V} />}>
          {INFLUENCERS.length === 0 ? (
            <EmptyState mensaje="Aún no hay creadores monitoreados." />
          ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 620 }}>
              <thead>
                <tr>
                  {['Creador', 'Categoría', 'Audiencia', 'Engagement', 'Spend estimado', 'Impacto estimado'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 12px', color: colores.textoOscuro,
                      fontWeight: 700, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.04em',
                      borderBottom: `1px solid ${colores.borde}`, whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INFLUENCERS.map(i => (
                  <tr key={i.nombre}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: colores.textoClaro, borderBottom: `1px solid ${colores.borde}` }}>{i.nombre}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoMedio, borderBottom: `1px solid ${colores.borde}` }}>{i.categoria}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoMedio, borderBottom: `1px solid ${colores.borde}` }}>{i.seguidores}</td>
                    <td style={{ padding: '10px 12px', color: colores.exito, fontWeight: 700, borderBottom: `1px solid ${colores.borde}` }}><TrendingUp size={11} style={{ verticalAlign: -1, marginRight: 4 }} />{i.engagementPct}%</td>
                    <td style={{ padding: '10px 12px', color: colores.textoClaro, fontVariantNumeric: 'tabular-nums', borderBottom: `1px solid ${colores.borde}` }}>{fmtMXN(i.spendEstimadoMXN)}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoOscuro, borderBottom: `1px solid ${colores.borde}` }}>{i.impactoEstimado}</td>
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
