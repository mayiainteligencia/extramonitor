import React from 'react';
import { Network, CheckCircle2, Clock, Database } from 'lucide-react';
import { Panel, Kpi, Insight, SectionHero, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';

const { colores } = brandingConfig;
const V = colores.primario;

type EstadoEntrega = 'al-dia' | 'con-retraso' | 'pendiente';

interface Proveedor {
  nombre: string;
  servicio: string;
  estado: EstadoEntrega;
  coberturaPct: number;
  frescura: string;
  ultimaSync: string;
  nota: string;
}

// Dato simulado: hoy solo HR Media entrega de verdad. El segundo renglón es un
// placeholder del ganador de la licitación en curso, no un proveedor real.
const PROVEEDORES: Proveedor[] = [
  {
    nombre: 'HR Media', servicio: 'Medición de audiencias (TV, Radio, Digital)',
    estado: 'al-dia', coberturaPct: 94, frescura: 'hace 6 horas', ultimaSync: 'hoy 06:40',
    nota: 'Proveedor de medición contratado por ACAM. Entrega diaria por feed.',
  },
  {
    nombre: 'Ganador de licitación (pendiente)', servicio: 'Monitoreo de medios tradicionales y CTV',
    estado: 'pendiente', coberturaPct: 0, frescura: 'sin datos', ultimaSync: '—',
    nota: 'Licitación de monitoreo de medios e inversión publicitaria en curso — prioridad #2 de ACAM. Este renglón se activa cuando haya proveedor asignado.',
  },
];

const ESTADO_META: Record<EstadoEntrega, { texto: string; color: string; icon: React.ComponentType<{ size?: number; color?: string }> }> = {
  'al-dia':      { texto: 'Entrega al día', color: colores.exito, icon: CheckCircle2 },
  'con-retraso': { texto: 'Con retraso',    color: colores.advertencia, icon: Clock },
  'pendiente':   { texto: 'Sin activar',    color: colores.textoOscuro, icon: Database },
};

const ProveedorCard: React.FC<{ p: Proveedor }> = ({ p }) => {
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
          ['Frescura del dato', p.frescura],
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

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Hub de Partners"
          title={<>Ingesta de <strong style={{ fontWeight: 800 }}>Proveedores</strong></>}
          subtitle="La sección que justifica el proyecto: por cada proveedor de medición, su estado de entrega, cobertura, frescura del dato y última sincronización."
          insights={<>
            <Insight kind="Análisis" title="Un solo proveedor activo hoy">
              HR Media es el único proveedor entregando dato en producción. El segundo renglón queda listo para activarse en cuanto la licitación de monitoreo resuelva.
            </Insight>
            <Insight kind="Sugerencia" title="La cobertura del 94% deja un 6% sin verificar">
              Ese remanente es candidato natural para el módulo de Consistencia entre Proveedores una vez que haya un segundo proveedor con quien comparar.
            </Insight>
          </>}
        />

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16, marginBottom: 22 }}>
          <Kpi label="Proveedores activos" value="1" sub="de 2 previstos" />
          <Kpi label="Cobertura promedio" value="94%" sub="sobre universo contratado" up />
          <Kpi label="Frescura máxima" value="6 h" sub="desde la última entrega" up />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {PROVEEDORES.map(p => <ProveedorCard key={p.nombre} p={p} />)}
        </div>
      </div>
    </div>
  );
};
