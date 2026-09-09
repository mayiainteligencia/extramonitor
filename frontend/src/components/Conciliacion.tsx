import React, { useMemo, useState } from 'react';
import { Scale, Paperclip, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Panel, Kpi, Insight, SectionHero, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { useRole, ROL_LABEL } from './shared/role';
import { TELEVISORAS, AGENCIAS, ASOCIADO_NOMBRE, fmtMXN } from '../data/media';

const { colores } = brandingConfig;
const V = colores.primario;

type EstadoCaso = 'abierto' | 'en-revision' | 'resuelto';

interface CasoConciliacion {
  id: string;
  television: string;   // id en TELEVISORAS
  agencia: string;       // id en AGENCIAS
  spot: string;
  plaza: string;
  reportadoMedio: number;   // spots que el medio dice haber transmitido
  reportadoAgencia: number; // spots que la agencia dice haber contratado y esperaba
  deltaMXN: number;
  evidencia: boolean;       // hay clip de Verificación On-Air adjunto
  estado: EstadoCaso;
  actualizado: string;
}

// Dato simulado — la mecánica es real: el clip con timestamp de Verificación
// On-Air es la evidencia que resuelve la disputa entre lo que el medio dice
// haber transmitido y lo que la agencia dice haber contratado.
const CASOS: CasoConciliacion[] = [
  { id: 'CC-101', television: 'TELEVISA', agencia: 'HAVAS',    spot: 'Spot 20" — bloque matutino', plaza: 'Ciudad de México', reportadoMedio: 42, reportadoAgencia: 48, deltaMXN: 87_000, evidencia: true,  estado: 'abierto',     actualizado: 'hace 2 h' },
  { id: 'CC-102', television: 'AZTECA',   agencia: 'GROUPM',   spot: 'Spot 30" — prime time',      plaza: 'Nuevo León',       reportadoMedio: 30, reportadoAgencia: 30, deltaMXN: 0,       evidencia: true,  estado: 'resuelto',    actualizado: 'ayer' },
  { id: 'CC-103', television: 'IMAGEN',   agencia: 'PUBLICIS', spot: 'Spot 15" — noticiero',        plaza: 'Jalisco',          reportadoMedio: 18, reportadoAgencia: 24, deltaMXN: 54_000, evidencia: true,  estado: 'en-revision', actualizado: 'hace 5 h' },
  { id: 'CC-104', television: 'TELEVISA', agencia: 'OMG',      spot: 'Spot 20" — fin de semana',    plaza: 'Puebla',           reportadoMedio: 12, reportadoAgencia: 16, deltaMXN: 38_000, evidencia: false, estado: 'abierto',     actualizado: 'hace 1 h' },
  { id: 'CC-105', television: 'AZTECA',   agencia: 'DENTSU',   spot: 'Spot 30" — franja infantil',  plaza: 'Estado de México', reportadoMedio: 22, reportadoAgencia: 20, deltaMXN: 0,       evidencia: true,  estado: 'resuelto',    actualizado: 'hace 2 días' },
  { id: 'CC-106', television: 'IMAGEN',   agencia: 'IPG',      spot: 'Spot 20" — deportivo',        plaza: 'Guanajuato',       reportadoMedio: 15, reportadoAgencia: 21, deltaMXN: 41_000, evidencia: false, estado: 'en-revision', actualizado: 'hace 8 h' },
];

const ESTADO_META: Record<EstadoCaso, { texto: string; color: string; icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  'abierto':     { texto: 'Abierto',     color: colores.peligro,     icon: AlertCircle },
  'en-revision': { texto: 'En revisión', color: colores.advertencia, icon: Clock },
  'resuelto':    { texto: 'Resuelto',    color: colores.exito,       icon: CheckCircle2 },
};

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

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Conciliación"
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
          {rol !== 'comite' && <> — solo tus propios casos ({rol === 'televisora' ? ASOCIADO_NOMBRE[asociadoId] : ASOCIADO_NOMBRE[asociadoId]})</>}
          {rol === 'comite' && <> — viendo ambas partes y el delta entre ellas</>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
          <Kpi label="Casos visibles" value={String(casosDelRol.length)} />
          <Kpi label="Abiertos o en revisión" value={String(abiertos)} up={abiertos === 0} />
          <Kpi label="Delta acumulado" value={`${fmtMXN(deltaTotal)} MXN`} sub="entre medio y agencia" />
        </div>

        <Panel title="Casos" icon={<Scale size={17} color={V} />} right={<span style={{ fontSize: 12, color: colores.textoOscuro }}>{casos.length} de {casosDelRol.length}</span>}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 760 }}>
              <thead>
                <tr>
                  {['Caso', 'Televisora', 'Agencia', 'Spot / plaza', 'Medio', 'Agencia (reportado)', 'Delta MXN', 'Evidencia', 'Estado'].map(h => (
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
                      <td style={{ padding: '10px 12px', borderBottom: `1px solid ${colores.borde}` }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: est.color }}>
                          <Icon size={12} /> {est.texto}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {casos.length === 0 && (
                  <tr><td colSpan={9} style={{ padding: '20px 12px', textAlign: 'center', color: colores.textoOscuro }}>Sin casos en este filtro.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <p style={{ fontSize: 11, color: colores.textoOscuro, margin: '14px 0 0', textAlign: 'center' }}>
          Asociados de referencia: {TELEVISORAS.map(t => t.nombre).join(', ')} (televisoras) · {AGENCIAS.map(a => a.nombre).join(', ')} (agencias).
        </p>
      </div>
    </div>
  );
};
