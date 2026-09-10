import React, { useState } from 'react';
import {
  GraduationCap, Radio, Megaphone, ShoppingCart, LineChart, Palette,
  ShieldAlert, Users2, Sparkles, Database, Route, Gauge, BarChart3, type LucideIcon,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { brandingConfig } from '../../config/branding';
import { Panel, Kpi, EstadoBadge } from '../shared/ui';

const { colores } = brandingConfig;

type Nivel = 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO';

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  duracion: string;
  nivel: Nivel;
  icono: LucideIcon;
}

// ponytail: la portada de cada curso es un ícono sobre gradiente en vez de un PNG.
// El diseño de tarjeta es el mismo; se ahorran ~39 MB de imágenes.
const RUTAS: { ruta: string; resumen: string; cursos: Curso[] }[] = [
  {
    ruta: 'Fundamentos de IA aplicada',
    resumen: 'Base común para los equipos técnicos de los 9 asociados',
    cursos: [
      { id: 1, titulo: 'Fundamentos del Prompting', descripcion: 'Ingeniería de prompts y casos de uso en medición', duracion: '4 HORAS', nivel: 'PRINCIPIANTE', icono: Sparkles },
      { id: 2, titulo: 'IA para Trabajo Inteligente', descripcion: 'Automatiza reportes, minutas y seguimiento de entregas', duracion: '25 HORAS', nivel: 'INTERMEDIO', icono: Gauge },
      { id: 3, titulo: 'Gobernanza y uso responsable', descripcion: 'Datos de proveedor, propiedad intelectual y sesgos', duracion: '8 HORAS', nivel: 'INTERMEDIO', icono: ShieldAlert },
      { id: 4, titulo: 'IA para el comité técnico', descripcion: 'Adopción, ROI y conversación con los asociados', duracion: '12 HORAS', nivel: 'AVANZADO', icono: Users2 },
    ],
  },
  {
    ruta: 'Inteligencia de medios',
    resumen: 'Del monitoreo on-air a la optimización de la pauta',
    cursos: [
      { id: 5, titulo: 'Monitoreo de medios con IA', descripcion: 'Testigos, transcripción y verificación de pauta', duracion: '20 HORAS', nivel: 'INTERMEDIO', icono: Radio },
      { id: 6, titulo: 'Planeación y compra asistida', descripcion: 'Costo por punto, mix y rebalanceo por plaza', duracion: '18 HORAS', nivel: 'INTERMEDIO', icono: Megaphone },
      { id: 7, titulo: 'Mix de medios y atribución', descripcion: 'MMM, incrementalidad y lectura de resultados', duracion: '30 HORAS', nivel: 'AVANZADO', icono: LineChart },
      { id: 8, titulo: 'Modelos de alcance y frecuencia', descripcion: 'Forecast de cobertura antes de comprometer compra', duracion: '24 HORAS', nivel: 'AVANZADO', icono: Route },
    ],
  },
  {
    ruta: 'Creatividad y comercio',
    resumen: 'Producción asistida y desempeño en el punto de venta digital',
    cursos: [
      { id: 9, titulo: 'Creatividad generativa', descripcion: 'Variantes por formato sin romper la guía de marca', duracion: '16 HORAS', nivel: 'INTERMEDIO', icono: Palette },
      { id: 10, titulo: 'E-Commerce e inteligencia de retail', descripcion: 'Catálogo, buy box, precio y disponibilidad', duracion: '20 HORAS', nivel: 'INTERMEDIO', icono: ShoppingCart },
      { id: 11, titulo: 'Journey y analítica de audiencias', descripcion: 'Segmentación, fricciones y drop-off por etapa', duracion: '28 HORAS', nivel: 'AVANZADO', icono: Users2 },
      { id: 12, titulo: 'Datos y calidad de medición', descripcion: 'Ingesta, limpieza y confianza en los tableros', duracion: '30 HORAS', nivel: 'AVANZADO', icono: Database },
    ],
  },
];

const NIVEL_COLOR: Record<Nivel, string> = {
  PRINCIPIANTE: '#10B981',
  INTERMEDIO: '#F59E0B',
  AVANZADO: '#EF4444',
};

export const Academia: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cursos = RUTAS.flatMap(r => r.cursos);
  const total = cursos.length;
  const horasTotales = cursos.reduce((s, c) => s + (parseInt(c.duracion, 10) || 0), 0);
  const niveles: Nivel[] = ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'];
  const porNivel = niveles.map(nivel => ({ nivel, cursos: cursos.filter(c => c.nivel === nivel).length }));
  const portadaH = isMobile ? '120px' : '150px';
  const minCard = isMobile ? '150px' : '230px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: isMobile ? 16 : 0 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 'bold', color: colores.textoClaro, margin: 0 }}>
            Academia
          </h2>
          <EstadoBadge estado="en-activacion" />
        </div>
        <p style={{ color: colores.textoMedio, fontSize: isMobile ? 14 : 16, margin: 0 }}>
          {RUTAS.length} rutas de capacitación en metodología de medición para los 9 asociados de ACAM
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 16 }}>
        <Kpi label="Rutas" value={String(RUTAS.length)} />
        <Kpi label="Cursos totales" value={String(total)} />
        <Kpi label="Horas de contenido" value={`${horasTotales} h`} />
      </div>

      <Panel title="Cursos por nivel" icon={<BarChart3 size={17} color={colores.primario} />}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={porNivel} margin={{ top: 10, right: 10, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colores.borde} vertical={false} />
            <XAxis dataKey="nivel" tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: colores.textoOscuro }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => [`${v} cursos`, 'Cursos']} />
            <Bar dataKey="cursos" radius={[6, 6, 0, 0]}>
              {porNivel.map(d => <Cell key={d.nivel} fill={NIVEL_COLOR[d.nivel]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {RUTAS.map(r => (
        <div key={r.ruta}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: colores.textoClaro, margin: 0 }}>{r.ruta}</h3>
            <span style={{ fontSize: 12.5, color: colores.textoOscuro }}>{r.resumen}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: colores.primario, background: `${colores.primario}18`,
              padding: '3px 9px', borderRadius: 999,
            }}>{r.cursos.length} cursos</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${minCard}, 1fr))`,
            gap: isMobile ? 12 : 20,
          }}>
            {r.cursos.map(card => {
              const isHovered = hoveredCard === card.id;
              const Icon = card.icono;
              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    backgroundColor: colores.fondoSecundario,
                    borderRadius: 16,
                    border: isHovered ? `2px solid ${colores.primario}` : `1px solid ${colores.borde}`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'none',
                    boxShadow: isHovered ? colores.sombraGrande : colores.sombra,
                  }}
                >
                  {/* Portada: ícono sobre gradiente, sin imagen */}
                  <div style={{
                    width: '100%', height: portadaH, position: 'relative', overflow: 'hidden',
                    background: `linear-gradient(135deg, ${colores.primario}22 0%, ${colores.primario}0A 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={isMobile ? 34 : 42} color={colores.primario} strokeWidth={1.4} />
                    <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ padding: '3px 7px', borderRadius: 6, backgroundColor: NIVEL_COLOR[card.nivel], color: '#fff', fontSize: 8, fontWeight: 'bold', letterSpacing: '0.5px' }}>
                        {card.nivel}
                      </span>
                      <span style={{ padding: '3px 7px', borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 8, fontWeight: 'bold' }}>
                        {card.duracion}
                      </span>
                    </div>
                    <div style={{
                      position: 'absolute', inset: 0, padding: 12, display: 'flex', alignItems: 'flex-end',
                      background: `linear-gradient(to top, ${colores.primario}F2 0%, ${colores.primario}B3 40%, transparent 100%)`,
                      opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease',
                    }}>
                      <p style={{ color: '#fff', fontSize: 11, margin: 0, lineHeight: 1.4, fontWeight: 600 }}>{card.descripcion}</p>
                    </div>
                  </div>

                  <div style={{ padding: '10px 12px', backgroundColor: isHovered ? colores.fondoTerciario : 'transparent', transition: 'background-color 0.3s ease', minHeight: 46 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: isHovered ? colores.primario : colores.textoClaro, margin: 0, lineHeight: 1.3, transition: 'color 0.3s ease' }}>
                      {card.titulo}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
        background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 14,
      }}>
        <GraduationCap size={18} color={colores.primario} />
        <span style={{ fontSize: 12.5, color: colores.textoMedio }}>
          Las rutas se cursan en orden; cada una cierra con un caso real de medición.
        </span>
      </div>
    </div>
  );
};
