import React, { useEffect, useState } from 'react';
import { Radio, Scale, ShieldCheck, TrendingUp, BookOpen, FileCheck2 } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import { Panel, Kpi, Insight, SectionHero, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { useRole, ROL_LABEL } from './shared/role';
import { PROVEEDORES, type EstadoEntrega } from '../data/partners';
import { CASOS } from '../data/conciliacion';
import { CONFLICTOS } from '../data/catalogo';
import { CIFRAS } from '../data/trazabilidad';
import { SERIE_COBERTURA, coberturaPct } from '../data/cobertura';
import { SERIE_INVERSION_MENSUAL, fmtMXN } from '../data/media';

const { colores } = brandingConfig;
const V = colores.primario;

// ── Contrato de datos por bloque ──
// Salud de proveedores      → data/partners.ts (PROVEEDORES). Fuente futura: heartbeat de ingesta. Granularidad: por sync.
// Casos de conciliación     → data/conciliacion.ts (CASOS). Fuente futura: Motor de Ingesta + Verificación On-Air. Por caso, filtrado por rol.
// Cobertura de verificación → data/cobertura.ts (SERIE_COBERTURA). Fuente futura: cruce Verificación On-Air ↔ Cruce de Entregas. Semanal.
// Inversión de industria    → data/media.ts (SERIE_INVERSION_MENSUAL). Fuente futura: HR Media → Modelo de Mix de Medios. Mensual.
// Homologación pendiente    → data/catalogo.ts (CONFLICTOS). Fuente futura: motor de matching del Catálogo Maestro.
// Actividad de auditoría    → data/trazabilidad.ts (CIFRAS). Fuente futura: publicaciones de Trazabilidad y Auditoría.

const ESTADO_COLOR: Record<EstadoEntrega, string> = {
  'al-dia': colores.exito,
  'con-retraso': colores.advertencia,
  'pendiente': colores.textoOscuro,
};
const ESTADO_TEXTO: Record<EstadoEntrega, string> = {
  'al-dia': 'Entregando',
  'con-retraso': 'Con retraso',
  'pendiente': 'Sin datos',
};

const MEDIOS_SERIE: { key: keyof typeof SERIE_INVERSION_MENSUAL[number]; label: string; color: string }[] = [
  { key: 'TV abierta', label: 'TV abierta', color: '#0F1E4D' },
  { key: 'Digital', label: 'Digital', color: '#1E3A8A' },
  { key: 'Radio', label: 'Radio', color: '#3B5BDB' },
  { key: 'OOH', label: 'OOH', color: '#64748B' },
  { key: 'CTV', label: 'CTV', color: '#0EA5E9' },
];

export const Tablero: React.FC = () => {
  const isMobile = useIsMobile();
  const { rol, asociadoId } = useRole();
  const [cargando, setCargando] = useState(true);

  // El resto de la app lee dummy local síncrono; Tablero es la única pantalla
  // que en producción agregará varias llamadas (proveedores, casos, cobertura,
  // inversión, catálogo, auditoría) al montar, así que es la única con skeleton.
  useEffect(() => {
    const t = setTimeout(() => setCargando(false), 450);
    return () => clearTimeout(t);
  }, []);

  const casosDelRol = rol === 'televisora' ? CASOS.filter(c => c.television === asociadoId)
    : rol === 'agencia' ? CASOS.filter(c => c.agencia === asociadoId)
    : CASOS;
  const abiertos = casosDelRol.filter(c => c.estado !== 'resuelto');
  const abiertosLargos = abiertos.filter(c => c.abiertoDesdeDias > 7).length;
  const deltaAbierto = abiertos.reduce((s, c) => s + c.deltaMXN, 0);

  const ultimaSemana = SERIE_COBERTURA[SERIE_COBERTURA.length - 1];
  const coberturaSerie = SERIE_COBERTURA.map(s => ({ semana: s.semana, pct: coberturaPct(s) }));

  const pendientesHomologacion = CONFLICTOS.filter(c => c.estado === 'pendiente').length;

  const auditoriaReciente = [...CIFRAS].slice(-5).reverse();

  if (cargando) {
    return (
      <div style={wrap(isMobile)}>
        <div style={inner}>
          <div style={{ height: 220, borderRadius: 22, background: colores.fondoSecundario, marginBottom: 22, animation: 'elFadeUp .4s ease both' }} />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 96, borderRadius: 14, background: colores.fondoSecundario }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Tablero"
          title={<>¿Está <strong style={{ fontWeight: 800 }}>sano</strong> el sistema hoy?</>}
          subtitle="Estado de la industria, no de una campaña: salud de proveedores, casos abiertos, cobertura de verificación e inversión agregada. Todo lo marcado como dato simulado lo es."
          insights={<>
            <Insight kind="Análisis" title={`${abiertos.length} casos de conciliación abiertos o en revisión`}>
              {abiertosLargos} llevan más de 7 días abiertos, con {fmtMXN(deltaAbierto)} MXN en disputa acumulada.
            </Insight>
            <Insight kind="Análisis" title={`Cobertura de verificación: ${coberturaPct(ultimaSemana)}% en ${ultimaSemana.semana}`}>
              {ultimaSemana.verificados} de {ultimaSemana.contratados} spots contratados fueron confirmados al aire esta semana.
            </Insight>
          </>}
        />

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 16px',
          background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 12, fontSize: 12.5, color: colores.textoMedio,
        }}>
          Viendo como <strong style={{ color: colores.textoClaro }}>{ROL_LABEL[rol]}</strong>
          {rol !== 'comite' && ' — los casos de conciliación de abajo son solo los tuyos; el resto es industria agregada'}
        </div>

        {/* Franja de salud de proveedores */}
        <Panel title="Salud de proveedores" icon={<Radio size={17} color={V} />} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {PROVEEDORES.map(p => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 260px',
                background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 12, padding: '12px 14px',
              }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: ESTADO_COLOR[p.estado], flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colores.textoClaro }}>{p.nombre}</div>
                  <div style={{ fontSize: 11, color: colores.textoOscuro }}>
                    {ESTADO_TEXTO[p.estado]}{p.frescuraHoras >= 0 && ` · última entrega hace ${p.frescuraHoras} h`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* KPIs principales */}
        <div style={{ ...{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 16 }, marginBottom: 20 }}>
          <Kpi label="Casos de conciliación (tu vista)" value={String(casosDelRol.length)} sub={`${abiertos.length} abiertos/en revisión`} up={abiertos.length === 0} />
          <Kpi label="Casos con más de 7 días abiertos" value={String(abiertosLargos)} up={abiertosLargos === 0} />
          <Kpi label="Cobertura de verificación" value={`${coberturaPct(ultimaSemana)}%`} sub={ultimaSemana.semana} up />
          <Kpi label="Conflictos de homologación" value={String(pendientesHomologacion)} sub="pendientes de resolución" up={pendientesHomologacion === 0} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr', gap: 16, marginBottom: 20 }}>
          <Panel title="Tendencia de cobertura de verificación (12 semanas)" icon={<TrendingUp size={17} color={V} />} right={<span style={{ fontSize: 11, color: colores.textoOscuro }}>dato simulado</span>}>
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={coberturaSerie} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
                  <XAxis dataKey="semana" tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} unit="%" domain={[70, 100]} />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Cobertura']} />
                  <Line type="monotone" dataKey="pct" stroke={V} strokeWidth={3} dot={{ r: 4, fill: V }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Inversión de industria por medio (12 meses)" icon={<Scale size={17} color={V} />} right={<span style={{ fontSize: 11, color: colores.textoOscuro }}>dato simulado</span>}>
            <div style={{ height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={SERIE_INVERSION_MENSUAL} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} tickFormatter={v => `$${Math.round(v / 1_000_000)}M`} />
                  <Tooltip formatter={(v: number) => fmtMXN(v)} />
                  {MEDIOS_SERIE.map(m => (
                    <Bar key={m.key} dataKey={m.key} name={m.label} stackId="medios" fill={m.color} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Actividad reciente de auditoría" icon={<ShieldCheck size={17} color={V} />} right={<span style={{ fontSize: 11, color: colores.textoOscuro }}>dato simulado</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {auditoriaReciente.map(c => (
              <div key={c.cifra} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 10,
              }}>
                <FileCheck2 size={14} color={V} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: colores.textoClaro }}>{c.cifra} — {c.valor}</div>
                  <div style={{ fontSize: 11, color: colores.textoOscuro }}>{c.proveedor} · {c.versionCorta} · {c.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <p style={{ fontSize: 11, color: colores.textoOscuro, margin: '14px 0 0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <BookOpen size={12} /> Homologación pendiente y auditoría vienen de Catálogo Maestro y Trazabilidad y Auditoría — ábrelas para el detalle.
        </p>
      </div>
    </div>
  );
};
