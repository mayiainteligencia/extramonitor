import React from 'react';
import { Tv, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Panel, Kpi, Insight, SectionHero, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { PERIODOS, ULTIMO, porPeriodo, fmtMXNCorto } from '../data/media';

const { colores } = brandingConfig;
const V = colores.primario;

const D = porPeriodo[ULTIMO];

const tendenciaCTV = PERIODOS.map(p => ({
  periodo: p,
  inversion: Math.round(porPeriodo[p].inversionPorMedio['CTV'] / 1_000_000),
  pct: Math.round(porPeriodo[p].inversionPorMedio['CTV'] / porPeriodo[p].inversionTotal * 1000) / 10,
}));

// Dato simulado — inventario y ocurrencias por plataforma CTV.
const INVENTARIO_CTV = [
  { plataforma: 'YouTube (conectada)', ocurrencias: 4820, inversionMXN: 210_000_000 },
  { plataforma: 'Streaming AVOD',      ocurrencias: 2140, inversionMXN: 96_000_000 },
  { plataforma: 'Smart TV (OEM)',      ocurrencias: 1360, inversionMXN: 58_000_000 },
  { plataforma: 'FAST channels',       ocurrencias: 980,  inversionMXN: 41_000_000 },
];

export const CTVSpend: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="CTV Spend"
          title={<>Medición de <strong style={{ fontWeight: 800 }}>Streaming</strong></>}
          subtitle="Inventario, ocurrencias e inversión estimada en CTV — la prioridad #1 declarada por ACAM: evolucionar la medición de contenido para incluir streaming. Dato simulado."
          insights={<>
            <Insight kind="Análisis" title="CTV crece periodo contra periodo">
              Pasó de {tendenciaCTV[0].pct}% del mix en {tendenciaCTV[0].periodo} a {tendenciaCTV[tendenciaCTV.length - 1].pct}% en {ULTIMO}. Sigue siendo el canal con menor cobertura de medición formal.
            </Insight>
            <Insight kind="Sugerencia" title="YouTube conectada concentra la mayor parte del inventario">
              Es también la plataforma con menor estandarización de reporte entre proveedores — candidata natural para la próxima ronda de homologación.
            </Insight>
          </>}
        />

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
          <Kpi label="Inversión CTV" value={fmtMXNCorto(D.inversionPorMedio['CTV'])} sub={`${tendenciaCTV[tendenciaCTV.length - 1].pct}% del mix`} up />
          <Kpi label="Ocurrencias detectadas" value={INVENTARIO_CTV.reduce((s, i) => s + i.ocurrencias, 0).toLocaleString('es-MX')} />
          <Kpi label="Plataformas cubiertas" value={String(INVENTARIO_CTV.length)} sub="dato simulado" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 16 }}>
          <Panel title="Tendencia de inversión en CTV (MDP)" icon={<TrendingUp size={17} color={V} />}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={tendenciaCTV} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
                  <XAxis dataKey="periodo" tick={{ fontSize: 12, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`$${v} MDP`, 'Inversión CTV']} />
                  <Line type="monotone" dataKey="inversion" stroke={V} strokeWidth={3} dot={{ r: 5, fill: V }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Inventario por plataforma" icon={<Tv size={17} color={V} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {INVENTARIO_CTV.map(i => (
                <div key={i.plataforma} style={{ background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 12, padding: '11px 13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: colores.textoClaro, marginBottom: 4 }}>
                    <span>{i.plataforma}</span>
                    <span>{fmtMXNCorto(i.inversionMXN)}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: colores.textoOscuro }}>{i.ocurrencias.toLocaleString('es-MX')} ocurrencias detectadas</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
