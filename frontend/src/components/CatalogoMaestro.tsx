import React, { useState } from 'react';
import { BookOpen, AlertTriangle, CheckCircle2, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Panel, Kpi, Insight, SectionHero, EmptyState, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { ANUNCIANTES, ASOCIADOS } from '../data/media';
import { CONFLICTOS, type TipoEntidad } from '../data/catalogo';

const { colores } = brandingConfig;
const V = colores.primario;

const TIPO_COLOR: Record<TipoEntidad, string> = { anunciante: V, marca: '#8B5CF6', medio: '#F97316' };
const TIPOS: TipoEntidad[] = ['anunciante', 'marca', 'medio'];

export const CatalogoMaestro: React.FC = () => {
  const isMobile = useIsMobile();
  const [filtro, setFiltro] = useState<'todos' | 'pendiente' | 'resuelto'>('todos');
  const pendientes = CONFLICTOS.filter(c => c.estado === 'pendiente').length;
  const tasaResolucion = CONFLICTOS.length ? Math.round(((CONFLICTOS.length - pendientes) / CONFLICTOS.length) * 100) : 0;
  const conflictosFiltrados = filtro === 'todos' ? CONFLICTOS : CONFLICTOS.filter(c => c.estado === filtro);

  const categorias = Array.from(new Set(ANUNCIANTES.map(a => a.categoria)));

  const porTipo = TIPOS.map(tipo => ({
    tipo,
    pendientes: CONFLICTOS.filter(c => c.tipo === tipo && c.estado === 'pendiente').length,
    resueltos: CONFLICTOS.filter(c => c.tipo === tipo && c.estado === 'resuelto').length,
  }));

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Catálogo Maestro"
          estado="demo"
          title={<>Diccionario <strong style={{ fontWeight: 800 }}>Único</strong></>}
          subtitle="Anunciantes, marcas, categorías y medios homologados entre proveedores, con las reglas de homologación y los conflictos pendientes de resolver. Dato simulado."
          insights={<>
            <Insight kind="Análisis" title={`${pendientes} conflictos de homologación abiertos`}>
              Cada uno representa una entidad reportada con nombres distintos por dos proveedores — sin resolverlos, el reporte de industria duplica o subestima spend.
            </Insight>
            <Insight kind="Sugerencia" title="Priorizar homologación de anunciantes sobre medios">
              Los medios cambian poco; los anunciantes rotan razón social con frecuencia — ahí concentra el mayor riesgo de doble conteo.
            </Insight>
          </>}
        />

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: 16, marginBottom: 22 }}>
          <Kpi label="Tasa de resolución" value={`${tasaResolucion}%`} sub={`${CONFLICTOS.length - pendientes} de ${CONFLICTOS.length}`} up={tasaResolucion >= 50} />
          <Kpi label="Conflictos pendientes" value={String(pendientes)} up={pendientes === 0} />
          <Kpi label="Anunciantes catalogados" value={String(ANUNCIANTES.length)} sub="dato simulado" />
          <Kpi label="Categorías / medios" value={`${categorias.length} / ${ASOCIADOS.length}`} />
        </div>

        <Panel title="Conflictos por tipo de entidad" icon={<BarChart3 size={17} color={V} />} style={{ marginBottom: 22 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={porTipo} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
              <XAxis dataKey="tipo" tick={{ fontSize: 12, fill: colores.textoOscuro }} axisLine={false} tickLine={false} style={{ textTransform: 'capitalize' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="resueltos" name="Resueltos" stackId="c" fill={colores.exito} radius={[0, 0, 0, 0]} />
              <Bar dataKey="pendientes" name="Pendientes" stackId="c" fill={colores.advertencia} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel
          title="Conflictos de homologación"
          icon={<BookOpen size={17} color={V} />}
          right={
            <div style={{ display: 'inline-flex', gap: 6 }}>
              {(['todos', 'pendiente', 'resuelto'] as const).map(f => (
                <button key={f} onClick={() => setFiltro(f)} style={{
                  border: `1px solid ${filtro === f ? V : colores.borde}`, background: filtro === f ? `${V}14` : 'transparent',
                  color: filtro === f ? V : colores.textoMedio, borderRadius: 9, padding: '6px 12px',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
                }}>{f}</button>
              ))}
            </div>
          }
          style={{ marginBottom: 22 }}
        >
          {conflictosFiltrados.length === 0 ? (
            <EmptyState mensaje="Sin conflictos en este filtro." />
          ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conflictosFiltrados.map(c => (
              <div key={c.entidad} style={{
                display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, alignItems: isMobile ? 'flex-start' : 'center',
                background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 12, padding: '12px 14px',
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: TIPO_COLOR[c.tipo], background: `${TIPO_COLOR[c.tipo]}18`, padding: '3px 9px', borderRadius: 999, textTransform: 'uppercase', flexShrink: 0 }}>{c.tipo}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: colores.textoClaro }}>{c.entidad}</div>
                  <div style={{ fontSize: 11.5, color: colores.textoOscuro, marginTop: 2 }}>
                    Variantes: {c.variantes.join(' · ')}
                  </div>
                  <div style={{ fontSize: 11, color: colores.textoOscuro, marginTop: 2 }}>Fuentes: {c.proveedores.join(', ')}</div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, flexShrink: 0,
                  color: c.estado === 'resuelto' ? colores.exito : colores.advertencia,
                }}>
                  {c.estado === 'resuelto' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                  {c.estado === 'resuelto' ? 'Resuelto' : 'Pendiente'}
                </span>
              </div>
            ))}
          </div>
          )}
        </Panel>

        <Panel title="Anunciantes catalogados" icon={<BookOpen size={17} color={V} />}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 520 }}>
              <thead>
                <tr>
                  {['Anunciante', 'Categoría', 'Agencia'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 12px', color: colores.textoOscuro,
                      fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em',
                      borderBottom: `1px solid ${colores.borde}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ANUNCIANTES.map(a => (
                  <tr key={a.nombre}>
                    <td style={{ padding: '10px 12px', color: colores.textoClaro, fontWeight: 700, borderBottom: `1px solid ${colores.borde}` }}>{a.nombre}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoMedio, borderBottom: `1px solid ${colores.borde}` }}>{a.categoria}</td>
                    <td style={{ padding: '10px 12px', color: colores.textoOscuro, borderBottom: `1px solid ${colores.borde}` }}>{a.agencia}</td>
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
