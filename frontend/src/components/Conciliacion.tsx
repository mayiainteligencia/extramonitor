import React, { useMemo, useState } from 'react';
import { Scale, Paperclip, CheckCircle2, Clock, AlertCircle, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Panel, Kpi, Insight, SectionHero, EmptyState, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { useRole, ROL_LABEL } from './shared/role';
import { TELEVISORAS, AGENCIAS, ASOCIADO_NOMBRE, fmtMXN } from '../data/media';
import { CASOS, type EstadoCaso } from '../data/conciliacion';

const { colores } = brandingConfig;
const V = colores.primario;

const ESTADO_META: Record<EstadoCaso, { texto: string; color: string; icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  'abierto':     { texto: 'Abierto',     color: colores.peligro,     icon: AlertCircle },
  'en-revision': { texto: 'En revisión', color: colores.advertencia, icon: Clock },
  'resuelto':    { texto: 'Resuelto',    color: colores.exito,       icon: CheckCircle2 },
};

// Rangos de antigüedad para el histograma — corte simple sobre abiertoDesdeDias.
const RANGOS_ANTIGUEDAD: { label: string; min: number; max: number }[] = [
  { label: '0-3 días', min: 0, max: 3 },
  { label: '4-7 días', min: 4, max: 7 },
  { label: '8-14 días', min: 8, max: 14 },
  { label: '15+ días', min: 15, max: Infinity },
];

export const Conciliacion: React.FC = () => {
  const isMobile = useIsMobile();
  const { rol, asociadoId } = useRole();
  const [filtroEstado, setFiltroEstado] = useState<'todos' | EstadoCaso>('todos');

  const casosDelRol = useMemo(() => {
    if (rol === 'televisora') return CASOS.filter(c => c.television === asociadoId);
    if (rol === 'agencia') return CASOS.filter(c => c.agencia === asociadoId);
    return CASOS;
  }, [rol, asociadoId]);

  const casos = filtroEstado === 'todos' ? casosDelRol : casosDelRol.filter(c => c.estado === filtroEstado);
  const abiertos = casosDelRol.filter(c => c.estado !== 'resuelto').length;
  const deltaTotal = casosDelRol.reduce((s, c) => s + c.deltaMXN, 0);

  const porEstado = (['abierto', 'en-revision', 'resuelto'] as EstadoCaso[]).map(e => ({
    estado: ESTADO_META[e].texto, valor: casosDelRol.filter(c => c.estado === e).length, fill: ESTADO_META[e].color,
  })).filter(d => d.valor > 0);

  const porAntiguedad = RANGOS_ANTIGUEDAD.map(r => ({
    rango: r.label,
    casos: casosDelRol.filter(c => c.abiertoDesdeDias >= r.min && c.abiertoDesdeDias <= r.max && c.estado !== 'resuelto').length,
  }));

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Conciliación"
          estado="demo"
          title={<>Resolución de <strong style={{ fontWeight: 800 }}>Disputas</strong></>}
          subtitle="Cuando una televisora y una agencia difieren sobre si un spot salió al aire, el clip con timestamp de Verificación On-Air resuelve la disputa. Dato simulado."
          right={
            <div style={{ display: 'inline-flex', gap: 6, background: 'rgba(255,255,255,.12)', padding: 5, borderRadius: 12, flexWrap: 'wrap' }}>
              {(['todos', 'abierto', 'en-revision', 'resuelto'] as const).map(f => {
                const on = f === filtroEstado;
                return (
                  <button key={f} onClick={() => setFiltroEstado(f)} style={{
                    border: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 9, fontSize: 12.5, fontWeight: 700,
                    background: on ? '#fff' : 'transparent', color: on ? colores.textoClaro : 'rgba(255,255,255,.75)', transition: 'all .2s',
                    textTransform: 'capitalize',
                  }}>{f === 'en-revision' ? 'En revisión' : f}</button>
                );
              })}
            </div>
          }
          insights={<>
            <Insight kind="Análisis" title={`${abiertos} casos abiertos o en revisión`}>
              El delta acumulado entre lo reportado por el medio y lo reportado por la agencia es {fmtMXN(deltaTotal)} MXN en los casos visibles para tu rol.
            </Insight>
            <Insight kind="Sugerencia" title="Priorizar casos sin evidencia adjunta">
              Sin el clip de Verificación On-Air, un caso puede quedar semanas en revisión — son los que más urge cerrar primero.
            </Insight>
          </>}
        />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 16px',
          background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 12, fontSize: 12.5, color: colores.textoMedio,
        }}>
          Viendo como <strong style={{ color: colores.textoClaro }}>{ROL_LABEL[rol]}</strong>
          {rol !== 'comite' && <> — solo tus propios casos ({ASOCIADO_NOMBRE[asociadoId]})</>}
          {rol === 'comite' && <> — viendo ambas partes y el delta entre ellas</>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
          <Kpi label="Casos visibles" value={String(casosDelRol.length)} />
          <Kpi label="Abiertos o en revisión" value={String(abiertos)} up={abiertos === 0} />
          <Kpi label="Delta acumulado" value={`${fmtMXN(deltaTotal)} MXN`} sub="entre medio y agencia" />
        </div>

        {casosDelRol.length === 0 ? (
          <Panel style={{ marginBottom: 22 }}><EmptyState mensaje="No tienes casos de conciliación en este momento." /></Panel>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: 16, marginBottom: 22 }}>
            <Panel title="Casos por estado" icon={<PieIcon size={17} color={V} />}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={porEstado} dataKey="valor" nameKey="estado" innerRadius={56} outerRadius={84} paddingAngle={3} stroke="none">
                    {porEstado.map(d => <Cell key={d.estado} fill={d.fill} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" height={28} />
                  <Tooltip formatter={(v: number, n: string) => [`${v} casos`, n]} />
                </PieChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Casos abiertos por antigüedad" icon={<BarChart3 size={17} color={V} />}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={porAntiguedad} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
                  <XAxis dataKey="rango" tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`${v} casos`, 'Abiertos/en revisión']} />
                  <Bar dataKey="casos" fill={colores.advertencia} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        )}

        <Panel title="Casos" icon={<Scale size={17} color={V} />} right={<span style={{ fontSize: 12, color: colores.textoOscuro }}>{casos.length} de {casosDelRol.length}</span>}>
          {casos.length === 0 ? (
            <EmptyState mensaje="Sin casos en este filtro." />
          ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 780 }}>
              <thead>
                <tr>
                  {['Caso', 'Televisora', 'Agencia', 'Spot / plaza', 'Medio', 'Agencia (reportado)', 'Delta MXN', 'Evidencia', 'Antigüedad', 'Estado'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 12px', color: colores.textoOscuro,
                      fontWeight: 700, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.04em',
                      borderBottom: `1px solid ${colores.borde}`, whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {casos.map(c => {
                  const est = ESTADO_META[c.estado];
                  const Icon = est.icon;
                  return (
                    <tr key={c.id}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: colores.textoClaro, borderBottom: `1px solid ${colores.borde}` }}>{c.id}</td>
                      <td style={{ padding: '10px 12px', color: colores.textoMedio, borderBottom: `1px solid ${colores.borde}` }}>{ASOCIADO_NOMBRE[c.television]}</td>
                      <td style={{ padding: '10px 12px', color: colores.textoMedio, borderBottom: `1px solid ${colores.borde}` }}>{ASOCIADO_NOMBRE[c.agencia]}</td>
                      <td style={{ padding: '10px 12px', color: colores.textoMedio, borderBottom: `1px solid ${colores.borde}` }}>{c.spot}<br /><span style={{ fontSize: 10.5, color: colores.textoOscuro }}>{c.plaza}</span></td>
                      <td style={{ padding: '10px 12px', color: colores.textoClaro, fontVariantNumeric: 'tabular-nums', borderBottom: `1px solid ${colores.borde}` }}>{c.reportadoMedio}</td>
                      <td style={{ padding: '10px 12px', color: colores.textoClaro, fontVariantNumeric: 'tabular-nums', borderBottom: `1px solid ${colores.borde}` }}>{c.reportadoAgencia}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: c.deltaMXN > 0 ? colores.peligro : colores.exito, borderBottom: `1px solid ${colores.borde}` }}>{fmtMXN(c.deltaMXN)}</td>
                      <td style={{ padding: '10px 12px', borderBottom: `1px solid ${colores.borde}` }}>
                        {c.evidencia ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: V, fontWeight: 700 }}><Paperclip size={12} /> Clip adjunto</span>
                        ) : (
                          <span style={{ fontSize: 11, color: colores.textoOscuro }}>Sin evidencia</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px', color: colores.textoOscuro, borderBottom: `1px solid ${colores.borde}` }}>{c.abiertoDesdeDias} días</td>
                      <td style={{ padding: '10px 12px', borderBottom: `1px solid ${colores.borde}` }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: est.color }}>
                          <Icon size={12} /> {est.texto}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </Panel>

        <p style={{ fontSize: 11, color: colores.textoOscuro, margin: '14px 0 0', textAlign: 'center' }}>
          Asociados de referencia: {TELEVISORAS.map(t => t.nombre).join(', ')} (televisoras) · {AGENCIAS.map(a => a.nombre).join(', ')} (agencias).
        </p>
      </div>
    </div>
  );
};
