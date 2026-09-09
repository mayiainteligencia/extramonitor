import React, { useState } from 'react';
import { PieChart as PieIcon, TrendingUp, Trophy, Megaphone } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Panel, Kpi, Insight, SectionHero, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { useRole, ROL_LABEL } from './shared/role';
import {
  porPeriodo, PERIODOS, ULTIMO, TELEVISORAS, ASOCIADO_COLOR, ASOCIADO_NOMBRE, fmt, fmtMXNCorto,
} from '../data/media';

const { colores } = brandingConfig;
const V = colores.primario;

const tendenciaInversion = PERIODOS.map(p => ({ periodo: p, inversion: Math.round(porPeriodo[p].inversionTotal / 1_000_000) }));

export const InvestmentValue: React.FC = () => {
  const isMobile = useIsMobile();
  const { rol, asociadoId } = useRole();
  const [anio, setAnio] = useState(ULTIMO);
  const D = porPeriodo[anio];
  const grid = (cols: string): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : cols, gap: 16 });

  const porAsociado = TELEVISORAS.map(tv => [tv.id, D.inversionPorAsociado[tv.id]] as const).sort((a, b) => b[1] - a[1]);
  const pieData = porAsociado.map(([id, v]) => ({ name: id, value: v }));
  const propioTV = rol === 'televisora' ? D.inversionPorAsociado[asociadoId] : undefined;

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Inversión Publicitaria"
          title={<>Reporte de <strong style={{ fontWeight: 800 }}>Industria</strong></>}
          subtitle="Spend por medio, categoría y anunciante entre los 9 asociados de ACAM. Dato simulado — la cifra oficial la publica el proveedor de medición contratado. Selecciona el periodo para comparar la evolución."
          right={
            <div style={{ display: 'inline-flex', gap: 6, background: 'rgba(255,255,255,.12)', padding: 5, borderRadius: 12 }}>
              {PERIODOS.map(a => {
                const on = String(a) === anio;
                return (
                  <button key={a} onClick={() => setAnio(String(a))} style={{
                    border: 'none', cursor: 'pointer', padding: '8px 20px', borderRadius: 9, fontSize: 14, fontWeight: 700,
                    background: on ? '#fff' : 'transparent', color: on ? colores.textoClaro : 'rgba(255,255,255,.75)', transition: 'all .2s',
                  }}>{a}</button>
                );
              })}
            </div>
          }
          insights={<>
            <Insight kind="Análisis" title={`La inversión de industria pasó de ${fmtMXNCorto(porPeriodo[PERIODOS[0]].inversionTotal)} (${PERIODOS[0]}) a ${fmtMXNCorto(porPeriodo[ULTIMO].inversionTotal)} (${ULTIMO})`}>
              Dato simulado sobre las cifras que entregan los 9 asociados a través de HR Media. La serie completa está en la gráfica de tendencia.
            </Insight>
            <Insight kind="Sugerencia" title="CTV crece periodo contra periodo">
              La participación de CTV en el mix de medios sube de forma sostenida — coincide con la prioridad #1 declarada por ACAM de evolucionar la medición hacia streaming.
            </Insight>
          </>}
        />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 16px',
          background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 12, fontSize: 12.5, color: colores.textoMedio,
        }}>
          Viendo como <strong style={{ color: colores.textoClaro }}>{ROL_LABEL[rol]}</strong>
          {propioTV != null && <> — inventario propio: <strong style={{ color: colores.textoClaro }}>{fmtMXNCorto(propioTV)}</strong></>}
        </div>

        {/* KPIs */}
        <div style={{ ...grid('repeat(4, 1fr)'), marginBottom: 22 }}>
          <Kpi label="Inversión total de industria" value={fmtMXNCorto(D.inversionTotal)} sub={`${fmt(D.grpsTotal)} GRPs`} up />
          <Kpi label="TV abierta" value={fmtMXNCorto(D.inversionPorMedio['TV abierta'])} sub="mayor participación" up />
          <Kpi label="CTV" value={fmtMXNCorto(D.inversionPorMedio['CTV'])} sub="prioridad #1 de ACAM" up />
          <Kpi label="Alcance promedio" value={`${D.alcanceProm}%`} sub={`${fmt(D.totalPlazas)} plazas`} up />
        </div>

        {/* Inventario por televisora + Tendencia histórica */}
        <div style={{ ...grid('1fr 1.3fr'), marginBottom: 22 }}>
          <Panel title={`Inventario de TV por televisora · ${anio}`} icon={<PieIcon size={17} color={V} />}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={{ width: 150, height: 150, position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="none">
                      {pieData.map(d => <Cell key={d.name} fill={ASOCIADO_COLOR[d.name] || colores.textoOscuro} />)}
                    </Pie>
                    <Tooltip formatter={(v: number, n: string) => [fmtMXNCorto(v), ASOCIADO_NOMBRE[n] ?? n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: colores.textoClaro }}>{fmtMXNCorto(D.inversionPorMedio['TV abierta'])}</span>
                  <span style={{ fontSize: 11, color: colores.textoOscuro }}>en TV</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
                {porAsociado.map(([id, v]) => (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: ASOCIADO_COLOR[id] || colores.textoOscuro, flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, color: colores.textoClaro, flex: 1 }}>{ASOCIADO_NOMBRE[id]}</span>
                    <span style={{ color: colores.textoOscuro, fontVariantNumeric: 'tabular-nums' }}>{fmtMXNCorto(v)} · {Math.round(v / D.inversionPorMedio['TV abierta'] * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Tendencia de inversión de industria (MDP)" icon={<TrendingUp size={17} color={V} />}>
            <div style={{ height: 210 }}>
              <ResponsiveContainer>
                <LineChart data={tendenciaInversion} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
                  <XAxis dataKey="periodo" tick={{ fontSize: 12, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`$${fmt(v)} MDP`, 'Inversión']} />
                  <Line type="monotone" dataKey="inversion" stroke={V} strokeWidth={3} dot={{ r: 5, fill: V }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* Inversión por medio + top anunciantes */}
        <div style={grid('1fr 1fr')}>
          <Panel title={`Inversión por medio · ${anio}`} icon={<Megaphone size={17} color={V} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {(Object.entries(D.inversionPorMedio) as [string, number][]).map(([medio, v]) => {
                const pct = Math.round(v / D.inversionTotal * 1000) / 10;
                return (
                  <div key={medio}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: colores.textoClaro }}>{medio}</span>
                      <span style={{ color: colores.textoOscuro, fontVariantNumeric: 'tabular-nums' }}>{fmtMXNCorto(v)} · {pct}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: colores.fondoTerciario, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: V, borderRadius: 999 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title={`Top anunciantes por categoría · ${anio}`} icon={<Trophy size={17} color={V} />} right={<span style={{ fontSize: 12, color: colores.textoOscuro }}>dato simulado</span>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {D.topAnunciantes.map((a, i) => (
                <div key={a.nombre} style={{ display: 'flex', alignItems: 'center', gap: 12, background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 11, padding: '10px 12px' }}>
                  <span style={{ width: 24, height: 24, borderRadius: 7, background: colores.textoClaro, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: colores.textoClaro, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nombre}</div>
                    <div style={{ fontSize: 11.5, color: colores.textoOscuro }}>{a.categoria}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: V, background: `${V}18`, padding: '3px 9px', borderRadius: 999, flexShrink: 0 }}>{fmtMXNCorto(a.inversionMXN)}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
