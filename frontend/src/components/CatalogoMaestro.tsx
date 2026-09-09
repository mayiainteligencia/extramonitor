import React, { useState } from 'react';
import { BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Panel, Kpi, Insight, SectionHero, keyframes, wrap, inner, useIsMobile } from './shared/ui';
import { brandingConfig } from '../config/branding';
import { ANUNCIANTES, ASOCIADOS } from '../data/media';

const { colores } = brandingConfig;
const V = colores.primario;

interface Conflicto {
  entidad: string;
  tipo: 'anunciante' | 'marca' | 'medio';
  variantes: string[];
  proveedores: string[];
  estado: 'pendiente' | 'resuelto';
}

// Dato simulado — conflictos típicos de homologación entre proveedores.
const CONFLICTOS: Conflicto[] = [
  { entidad: 'Liverpool', tipo: 'anunciante', variantes: ['Liverpool', 'El Puerto de Liverpool', 'LIVERPOOL SAB'], proveedores: ['HR Media', 'Feed de licitación (piloto)'], estado: 'pendiente' },
  { entidad: 'BBVA México', tipo: 'anunciante', variantes: ['BBVA', 'BBVA Bancomer', 'BBVA México'], proveedores: ['HR Media'], estado: 'pendiente' },
  { entidad: 'Nissan', tipo: 'marca', variantes: ['Nissan', 'Nissan Mexicana'], proveedores: ['HR Media', 'Feed de licitación (piloto)'], estado: 'resuelto' },
  { entidad: 'Imagen Televisión', tipo: 'medio', variantes: ['Imagen TV', 'Grupo Imagen', 'Imagen Televisión'], proveedores: ['HR Media'], estado: 'resuelto' },
];

const TIPO_COLOR: Record<Conflicto['tipo'], string> = { anunciante: V, marca: '#8B5CF6', medio: '#F97316' };

export const CatalogoMaestro: React.FC = () => {
  const isMobile = useIsMobile();
  const [filtro, setFiltro] = useState<'todos' | 'pendiente' | 'resuelto'>('todos');
  const pendientes = CONFLICTOS.filter(c => c.estado === 'pendiente').length;
  const conflictosFiltrados = filtro === 'todos' ? CONFLICTOS : CONFLICTOS.filter(c => c.estado === filtro);

  const categorias = Array.from(new Set(ANUNCIANTES.map(a => a.categoria)));

  return (
    <div style={wrap(isMobile)}>
      <style>{keyframes}</style>
      <div style={inner}>
        <SectionHero
          eyebrow="Catálogo Maestro"
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
          <Kpi label="Anunciantes catalogados" value={String(ANUNCIANTES.length)} sub="dato simulado" />
          <Kpi label="Categorías" value={String(categorias.length)} />
          <Kpi label="Medios / asociados" value={String(ASOCIADOS.length)} />
          <Kpi label="Conflictos pendientes" value={String(pendientes)} sub="de homologación" up={pendientes === 0} />
        </div>

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
            {conflictosFiltrados.length === 0 && (
              <p style={{ fontSize: 13, color: colores.textoOscuro, margin: 0 }}>Sin conflictos en este filtro.</p>
            )}
          </div>
        </Panel>

        <Panel title="Anunciantes catalogados" icon={<BookOpen size={17} color={V} />}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, minWidth: 520 }}>
              <thead>
                <tr>
                  {['Anunciante', 'Categoría', 'Agencia'].map((h, i) => (
                    <th key={h} style={{
                      textAlign: i === 0 ? 'left' : 'left', padding: '10px 12px', color: colores.textoOscuro,
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
