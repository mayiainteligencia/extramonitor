import React, { useState, useEffect } from 'react';
import {
  Megaphone, Palette, ShoppingCart, Swords, TrendingUp, Users2, Tag,
  ShieldAlert, PieChart as PieChartIcon, Radio, X,
} from 'lucide-react';
import {
  ScatterChart, Scatter, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import { brandingConfig } from '../config/branding';
import { porPeriodo, ULTIMO, COBERTURA, MARCAS, CLIENTE, ALERTAS, fmt, fmtMXNCorto } from '../data/media';

const { colores } = brandingConfig;
const V = colores.primario;
const TXT = colores.textoClaro;
const MUT = colores.textoOscuro;
const MED = colores.textoMedio;

const D = porPeriodo[ULTIMO];
const recuperableMXN = D.discrepancias.reduce((s, d) => s + d.montoMXN, 0);

const useIsMobile = (bp = 768) => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < bp);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [bp]);
  return m;
};

// ── primitivas ──
const sub: React.CSSProperties = {
  background: colores.fondoSecundario, border: `1px solid ${colores.borde}`, borderRadius: 14, padding: 16,
};
const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 700, color: MED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>{children}</div>
);
const Chip: React.FC<{ t: string; c: string; solid?: boolean }> = ({ t, c, solid }) => (
  <span style={{
    fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '3px 9px', whiteSpace: 'nowrap',
    color: solid ? '#fff' : c, background: solid ? c : `${c}1A`, border: `1px solid ${c}33`,
  }}>{t}</span>
);

// ── gráfica pequeña del modal ──
type Grafica =
  | { tipo: 'area'; titulo: string; data: { x: string; v: number }[] }
  | { tipo: 'bars'; titulo: string; data: { x: string; v: number }[] }
  | { tipo: 'scatter'; titulo: string; ejeX: string; ejeY: string; data: { x: number; y: number; z: number; n: string }[] };

const serie = (vals: number[], etiquetas?: string[]) =>
  vals.map((v, i) => ({ x: etiquetas?.[i] ?? `${i + 1}`, v }));

const ejes = {
  tick: { fill: MUT, fontSize: 10 },
  tooltip: { background: colores.fondoClaro, border: `1px solid ${colores.borde}`, borderRadius: 10, fontSize: 12 },
};

const MiniChart: React.FC<{ g: Grafica }> = ({ g }) => (
  <div style={sub}>
    <SubTitle>{g.titulo}</SubTitle>
    <ResponsiveContainer width="100%" height={190}>
      {g.tipo === 'area' ? (
        <AreaChart data={g.data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          <CartesianGrid stroke={colores.borde} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="x" tick={ejes.tick} axisLine={false} tickLine={false} />
          <YAxis tick={ejes.tick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={ejes.tooltip} />
          <Area type="monotone" dataKey="v" stroke={V} strokeWidth={2} fill={`${V}33`} />
        </AreaChart>
      ) : g.tipo === 'bars' ? (
        <BarChart data={g.data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          <CartesianGrid stroke={colores.borde} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="x" tick={ejes.tick} axisLine={false} tickLine={false} />
          <YAxis tick={ejes.tick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={ejes.tooltip} cursor={{ fill: `${V}12` }} />
          <Bar dataKey="v" fill={V} radius={[6, 6, 0, 0]} />
        </BarChart>
      ) : (
        <ScatterChart margin={{ top: 8, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid stroke={colores.borde} strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name={g.ejeX} tick={ejes.tick} axisLine={false} tickLine={false} />
          <YAxis type="number" dataKey="y" name={g.ejeY} tick={ejes.tick} axisLine={false} tickLine={false} />
          <ZAxis type="number" dataKey="z" range={[120, 700]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={ejes.tooltip} />
          <Scatter data={g.data}>
            {g.data.map((_, i) => <Cell key={i} fill={V} fillOpacity={0.7} />)}
          </Scatter>
        </ScatterChart>
      )}
    </ResponsiveContainer>
  </div>
);

// ════════════════════════ CONTENIDO DE LOS 10 MÓDULOS ════════════════════════
// Cada detalle: una línea de descripción, 3-4 métricas y una gráfica pequeña.

type Detalle = {
  num: number;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  tag: 'Operador' | 'Modelo' | 'Agente de Insights';
  titulo: string;
  descripcion: string;
  enVivo?: boolean;
  metricas: { label: string; value: string }[];
  grafica: Grafica;
};

const DETALLES: Detalle[] = [
  {
    num: 1, icon: Radio, tag: 'Operador', titulo: 'Operador de Testigos', enVivo: true,
    descripcion: 'Escucha las emisoras en vivo y confirma que cada spot contratado salió al aire.',
    metricas: [
      { label: 'Emisoras monitoreadas', value: fmt(COBERTURA.emisoras) },
      { label: 'Spots verificados hoy', value: '1,342' },
      { label: 'Precisión de match', value: '98.6%' },
      { label: 'Latencia de detección', value: '11 s' },
    ],
    grafica: { tipo: 'bars', titulo: 'Spots verificados por hora', data: serie([62, 88, 141, 120, 96, 133, 158, 112], ['06', '08', '10', '12', '14', '16', '18', '20']) },
  },
  {
    num: 2, icon: Megaphone, tag: 'Operador', titulo: 'Operador de Pauta',
    descripcion: 'Rebalancea la compra online y offline entre plazas según el costo por punto.',
    metricas: [
      { label: 'Plazas optimizadas', value: fmt(D.totalPlazas) },
      { label: 'Inversión gestionada', value: fmtMXNCorto(D.inversionCliente) },
      { label: 'Ahorro por rebalanceo', value: '7.4%' },
      { label: 'Órdenes emitidas', value: '318' },
    ],
    grafica: { tipo: 'area', titulo: 'Costo por punto de rating (índice)', data: serie([100, 96, 93, 91, 88, 86, 84, 82]) },
  },
  {
    num: 3, icon: Palette, tag: 'Operador', titulo: 'Operador de Contenido',
    descripcion: 'Genera variantes creativas por formato y plaza a partir de la pieza maestra.',
    metricas: [
      { label: 'Piezas generadas', value: '486' },
      { label: 'Formatos activos', value: '9' },
      { label: 'Aprobación en 1er pase', value: '72%' },
      { label: 'Tiempo por variante', value: '2.4 min' },
    ],
    grafica: { tipo: 'bars', titulo: 'Variantes por formato', data: serie([92, 78, 64, 51, 38], ['Radio 20s', 'Video 15s', 'Display', 'Social', 'OOH']) },
  },
  {
    num: 4, icon: ShoppingCart, tag: 'Operador', titulo: 'Operador de E-Commerce',
    descripcion: 'Vigila catálogo, precio y disponibilidad en marketplaces y retail propio.',
    metricas: [
      { label: 'SKUs monitoreados', value: '1,208' },
      { label: 'Quiebres de stock', value: '17' },
      { label: 'Buy box ganada', value: '68%' },
      { label: 'Desvío de precio', value: '±3.2%' },
    ],
    grafica: { tipo: 'area', titulo: 'Disponibilidad de catálogo (%)', data: serie([88, 91, 87, 93, 90, 95, 94, 96]) },
  },
  {
    num: 5, icon: PieChartIcon, tag: 'Modelo', titulo: 'Modelo de Mix de Medios (MMM)',
    descripcion: 'Atribuye a cada canal su contribución a las ventas y guía el reparto de inversión.',
    metricas: [
      { label: 'Canales modelados', value: '7' },
      { label: 'R² del modelo', value: '0.86' },
      { label: 'ROI incremental', value: '2.4x' },
      { label: 'Ventana de arrastre', value: '3 sem' },
    ],
    grafica: { tipo: 'bars', titulo: 'Contribución por canal (%)', data: serie([34, 28, 22, 11, 5], ['Radio', 'Digital', 'TV', 'OOH', 'Otros']) },
  },
  {
    num: 6, icon: TrendingUp, tag: 'Modelo', titulo: 'Modelo Predictivo de Alcance',
    descripcion: 'Proyecta cobertura y frecuencia efectiva antes de comprometer la compra.',
    metricas: [
      { label: 'Alcance proyectado', value: `${D.alcanceProm + 6}%` },
      { label: 'Frecuencia efectiva', value: '4.2' },
      { label: 'Error vs real', value: '±3.1 pts' },
      { label: 'GRPs simulados', value: fmt(D.grpsTotal) },
    ],
    grafica: { tipo: 'area', titulo: 'Curva de alcance vs GRPs', data: serie([12, 28, 42, 54, 63, 70, 75, 78]) },
  },
  {
    num: 7, icon: Tag, tag: 'Modelo', titulo: 'Modelo de Elasticidad de Precio',
    descripcion: 'Estima la sensibilidad al precio por plaza y el umbral de promoción rentable.',
    metricas: [
      { label: 'Elasticidad media', value: '-1.34' },
      { label: 'Plazas sensibles', value: '11' },
      { label: 'Margen protegido', value: fmtMXNCorto(38_400_000) },
      { label: 'Umbral de descuento', value: '12%' },
    ],
    grafica: {
      tipo: 'scatter', titulo: 'Precio relativo vs volumen por plaza', ejeX: 'Precio', ejeY: 'Volumen',
      data: [
        { x: 88, y: 74, z: 420, n: 'CDMX' }, { x: 94, y: 61, z: 320, n: 'Jalisco' },
        { x: 102, y: 52, z: 280, n: 'N. León' }, { x: 110, y: 41, z: 220, n: 'Puebla' },
        { x: 97, y: 58, z: 260, n: 'Edomex' }, { x: 118, y: 33, z: 180, n: 'Yucatán' },
      ],
    },
  },
  {
    num: 8, icon: Users2, tag: 'Agente de Insights', titulo: 'Agente de Insights de Consumidor',
    descripcion: 'Convierte señales de audiencia en hallazgos accionables por segmento.',
    metricas: [
      { label: 'Clústeres', value: '12' },
      { label: 'Audiencia prioritaria', value: '8.4%' },
      { label: 'Insights del mes', value: '46' },
      { label: 'Perfiles analizados', value: '2.1M' },
    ],
    grafica: {
      tipo: 'scatter', titulo: 'Clústeres de audiencia', ejeX: 'Afinidad', ejeY: 'Valor',
      data: [
        { x: 20, y: 80, z: 400, n: 'Prioritaria' }, { x: 45, y: 60, z: 900, n: 'Premium' },
        { x: 65, y: 40, z: 1400, n: 'Frecuente' }, { x: 80, y: 25, z: 1100, n: 'Casual' },
        { x: 35, y: 35, z: 600, n: 'Nicho' },
      ],
    },
  },
  {
    num: 9, icon: Swords, tag: 'Agente de Insights', titulo: 'Agente de Competencia',
    descripcion: 'Sigue el Share of Voice y los movimientos de pauta del mercado.',
    metricas: [
      { label: 'Marcas rastreadas', value: '52' },
      { label: `SOV ${CLIENTE.nombre}`, value: `${D.sovCliente}%` },
      { label: 'Movimientos detectados', value: '17' },
      { label: '2ª marca', value: D.segundaMarca },
    ],
    grafica: {
      tipo: 'bars', titulo: 'Inversión por marca (%)',
      data: MARCAS.map(m => ({ x: m.nombre, v: Math.round(D.inversionPorMarca[m.id] / D.inversionTotal * 100) })),
    },
  },
  {
    num: 10, icon: ShieldAlert, tag: 'Agente de Insights', titulo: 'Agente de Anomalías',
    descripcion: 'Detecta fraude publicitario, discrepancias de pauta y gasto desperdiciado.',
    metricas: [
      { label: 'Anomalías abiertas', value: fmt(ALERTAS.length) },
      { label: 'Presupuesto recuperable', value: fmtMXNCorto(recuperableMXN) },
      { label: 'Tráfico inválido', value: '4.7%' },
      { label: 'Viewability', value: '71%' },
    ],
    grafica: { tipo: 'bars', titulo: 'Anomalías por tipo', data: serie([3, 2, 2, 1], ['Pauta', 'Competencia', 'Ad fraud', 'Menciones']) },
  },
];

const DetalleModulo: React.FC<{ d: Detalle; isMobile: boolean }> = ({ d, isMobile }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <p style={{ fontSize: 13.5, color: MED, lineHeight: 1.5, margin: 0 }}>{d.descripcion}</p>

    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : `repeat(${d.metricas.length},1fr)`, gap: 10 }}>
      {d.metricas.map(m => (
        <div key={m.label} style={{ ...sub, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: TXT, lineHeight: 1.2 }}>{m.value}</div>
          <div style={{ fontSize: 10.5, color: MUT, marginTop: 4 }}>{m.label}</div>
        </div>
      ))}
    </div>

    <MiniChart g={d.grafica} />

    {d.enVivo && (
      <p style={{ fontSize: 11.5, color: MUT, margin: 0 }}>
        Único módulo conectado a datos en vivo — se alimenta del servicio de monitoreo de la sección Testigos IA.
      </p>
    )}
  </div>
);

// ════════════════════════ REGISTRO + MODAL ════════════════════════
export const META = DETALLES.map(d => ({ num: d.num, icon: d.icon, tag: d.tag, titulo: d.titulo }));

export const ModuloDetalleModal: React.FC<{ num: number | null; onClose: () => void }> = ({ num, onClose }) => {
  const isMobile = useIsMobile();
  useEffect(() => {
    if (num == null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [num, onClose]);

  if (num == null) return null;
  const d = DETALLES.find(x => x.num === num);
  if (!d) return null;
  const { icon: Icon, tag, titulo } = d;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(10,10,10,0.55)',
      backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: isMobile ? 12 : 32, overflowY: 'auto', animation: 'iel-fadeup .2s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: colores.fondoClaro, borderRadius: 20, border: `1px solid ${colores.borde}`,
        boxShadow: colores.sombraGrande, width: '100%', maxWidth: 920, padding: isMobile ? 16 : 26,
        animation: 'mia-modal .25s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: colores.gradientePrimario, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
            <Icon size={20} color="#fff" />
            <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 999, background: V, color: '#0A0A0A', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{num}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: V, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{tag}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: TXT, margin: '2px 0 0' }}>{titulo}</h3>
          </div>
          {d.enVivo && <Chip t="DATOS EN VIVO" c={colores.exito} solid />}
          <button onClick={onClose} aria-label="Cerrar" style={{
            width: 36, height: 36, borderRadius: 10, cursor: 'pointer', flexShrink: 0,
            background: colores.fondoSecundario, border: `1px solid ${colores.borde}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><X size={18} color={MED} /></button>
        </div>
        <DetalleModulo d={d} isMobile={isMobile} />
      </div>
    </div>
  );
};
