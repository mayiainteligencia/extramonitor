import React from 'react';
import { Network, CheckCircle2, Clock, Database, CalendarClock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Panel, Kpi, Insight, SectionHero, EmptyState, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { PROVEEDORES, HISTORIAL_ENTREGAS, type EstadoEntrega } from '../data/partners';

const { colores } = brandingConfig;
const V = colores.primario;

const ESTADO_META: Record<EstadoEntrega, { texto: string; color: string; icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  'al-dia':      { texto: 'Entrega al día', color: colores.exito, icon: CheckCircle2 },
  'con-retraso': { texto: 'Con retraso',    color: colores.advertencia, icon: Clock },
  'pendiente':   { texto: 'Sin activar',    color: colores.textoOscuro, icon: Database },
};

const ProveedorCard: React.FC<{ p: (typeof PROVEEDORES)[number] }> = ({ p }) => {
  const est = ESTADO_META[p.estado];
  const Icon = est.icon;
  return (
    <Panel
      title={p.nombre}
      icon={<div style={{ width: 34, height: 34, borderRadius: 10, background: `${V}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Network size={17} color={V} /></div>}
      right={
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700,
          color: est.color, background: `${est.color}1A`, border: `1px solid ${est.color}40`,
          padding: '4px 10px', borderRadius: 999,
        }}><Icon size={12} color={est.color} /> {est.texto}</span>
      }
    >
      <p style={{ fontSize: 12.5, color: colores.textoOscuro, margin: '0 0 14px' }}>{p.servicio}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
        {[
          ['Cobertura', `${p.coberturaPct}%`],
          ['Frescura del dato', p.frescuraHoras >= 0 ? `hace ${p.frescuraHoras} h` : 'sin datos'],
          ['Última sincronización', p.ultimaSync],
        ].map(([l, v]) => (
          <div key={l} style={{ background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 11, padding: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: colores.textoClaro, lineHeight: 1.2 }}>{v}</div>
            <div style={{ fontSize: 10.5, color: colores.textoOscuro, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11.5, color: colores.textoOscuro, margin: 0, lineHeight: 1.5 }}>{p.nota}</p>
    </Panel>
  );
};

export const HubPartners: React.FC = () => {
  const isMobile = useIsMobile();
  const activos = PROVEEDORES.filter(p => p.estado !== 'pendiente');
  const coberturaProm = activos.length ? Math.round(activos.reduce((s, p) => s + p.coberturaPct, 0) / activos.length) : 0;
  const frescuraMax = activos.length ? Math.min(...activos.map(p => p.frescuraHoras)) : 0;

  const dias = Array.from(new Set(HISTORIAL_ENTREGAS.map(e => e.dia))).sort();
  const timeline = dias.map(dia => {
    const deEseDia = HISTORIAL_ENTREGAS.filter(e => e.dia === dia);
    return {
      dia: dia.slice(5).replace('-', '/'), // MM/DD
      entregaron: deEseDia.filter(e => e.entregado === true).length,
      activos: deEseDia.filter(e => e.entregado !== null).length,
    };
  });

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Hub de Partners"
          estado="en-activacion"
          title={<>Ingesta de <strong style={{ fontWeight: 800 }}>Proveedores</strong></>}
          subtitle="La sección que justifica el proyecto: por cada proveedor de medición, su estado de entrega, cobertura, frescura del dato y última sincronización."
          insights={<>
            <Insight kind="Análisis" title={`${activos.length} de ${PROVEEDORES.length} proveedores activos hoy`}>
              HR Media es el único proveedor entregando dato en producción. El segundo renglón queda listo para activarse en cuanto la licitación de monitoreo resuelva.
            </Insight>
            <Insight kind="Sugerencia" title={`La cobertura del ${coberturaProm}% deja un remanente sin verificar`}>
              Ese remanente es candidato natural para el módulo de Consistencia entre Proveedores una vez que haya un segundo proveedor con quien comparar.
            </Insight>
          </>}
        />

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
          <Kpi label="Proveedores al día" value={`${activos.length} de ${PROVEEDORES.length}`} up={activos.length === PROVEEDORES.length} />
          <Kpi label="Cobertura promedio" value={`${coberturaProm}%`} sub="sobre universo contratado" up />
          <Kpi label="Frescura máxima" value={activos.length ? `${frescuraMax} h` : '—'} sub="desde la última entrega" up />
        </div>

        <Panel title="Entregas por día (últimos 14 días)" icon={<CalendarClock size={17} color={V} />} style={{ marginBottom: 22 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeline} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} domain={[0, PROVEEDORES.length]} tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number, _n, item) => [`${v} de ${item?.payload?.activos ?? PROVEEDORES.length} proveedores activos`, 'Entregaron']} />
              <Bar dataKey="entregaron" radius={[5, 5, 0, 0]}>
                {timeline.map((d, i) => (
                  <Cell key={i} fill={d.activos === 0 ? colores.borde : d.entregaron === d.activos ? colores.exito : colores.advertencia} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: colores.textoOscuro, margin: '10px 0 0' }}>
            Cada barra corta frente al total de proveedores activos ese día es un hueco de entrega. Dato simulado.
          </p>
        </Panel>

        {PROVEEDORES.length === 0 ? (
          <Panel><EmptyState mensaje="Aún no hay proveedores registrados." /></Panel>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PROVEEDORES.map(p => <ProveedorCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};
