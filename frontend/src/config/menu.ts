import {
  LayoutDashboard,
  Radio,
  BrainCircuit,
  Command,
  ClipboardList,
  Bell,
  Globe,
  Route,
  MapPin,
  ShieldAlert,
  Palette,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { brandingConfig } from './branding';

export type EstadoSeccion = 'activo' | 'demo' | 'en-activacion';

export interface ItemMenu {
  id: string;
  nombre: string;
  icono: LucideIcon;
  estado: EstadoSeccion;
  grupo: 'principal' | 'extra';
  /** Una línea de qué hace la sección. La usa el asistente para explicarla. */
  descripcion: string;
}

// Fuente única del menú: Sidebar, ResponsiveLayout y el switch de App.tsx
// se alimentan de este array. Cualquier sección nueva se agrega aquí.
export const secciones: ItemMenu[] = [
  { id: 'warroom',    nombre: 'War Room de Cliente',          icono: LayoutDashboard, estado: 'demo',          grupo: 'principal',
    descripcion: 'La vista de arranque: cartera de cuentas, Share of Voice por plaza en el mapa de México y los accesos rápidos al resto del tablero.' },
  { id: 'testigos',   nombre: 'Testigos IA',                  icono: Radio,           estado: 'activo',        grupo: 'principal',
    descripcion: 'Monitoreo on-air en vivo: escucha las emisoras, transcribe y verifica que cada spot contratado haya salido al aire. Es la única sección conectada a datos reales.' },
  { id: 'cerebro',    nombre: 'Cerebro Orquestador',          icono: BrainCircuit,    estado: 'en-activacion', grupo: 'principal',
    descripcion: 'La capa que coordina la plataforma: 4 Agentes que operan el flujo de trabajo (intake, tráfico, SLA y presupuesto), 2 Operadores que ejecutan sobre los medios, 2 Modelos que predicen y 2 Agentes de Insights que generan hallazgos.' },
  { id: 'comando',    nombre: 'Comando de Campaña',           icono: Command,         estado: 'demo',          grupo: 'principal',
    descripcion: 'Vista de mando de la campaña en curso: KPIs, alertas del sistema, actividad reciente, inversión por marca y reparto de pauta por franja horaria.' },
  { id: 'investment', nombre: 'Investment Value IA',          icono: ClipboardList,   estado: 'demo',          grupo: 'principal',
    descripcion: 'El valor de la inversión: plazas lideradas, inversión por marca, GRPs, tendencia de Share of Voice y las top plazas por inversión.' },
  { id: 'alertas',    nombre: 'Alertas de Marca',             icono: Bell,            estado: 'demo',          grupo: 'principal',
    descripcion: 'Discrepancias de pauta, menciones negativas, spikes de competencia y ad fraud. Cada alerta se puede convertir en un reclamo al medio.' },
  { id: 'digital',    nombre: 'Monitor Digital & E-Commerce', icono: Globe,           estado: 'en-activacion', grupo: 'principal',
    descripcion: 'Tráfico, embudo de conversión, marketplaces, sentimiento en redes y visibilidad en buscadores y en respuestas de IA (GEO/AEO).' },
  { id: 'journey',    nombre: 'Journey Intelligence',         icono: Route,           estado: 'en-activacion', grupo: 'principal',
    descripcion: 'El recorrido del consumidor por etapa (awareness, consideración, conversión, lealtad) con sus puntos de fricción, touchpoints por canal y drop-off.' },
  { id: 'ooh',        nombre: 'OOH Planner',                  icono: MapPin,          estado: 'demo',          grupo: 'principal',
    descripcion: 'Inventario exterior real: 775 soportes con tarifa y disponibilidad, el circuito medido con su audiencia por edad y NSE, y un builder para armar circuitos y ver sus métricas.' },
  { id: 'adfraud',    nombre: 'Ad Fraud & Brand Safety',      icono: ShieldAlert,     estado: 'en-activacion', grupo: 'extra',
    descripcion: 'Tráfico inválido, viewability por formato, adyacencia de contenido riesgoso y el presupuesto recuperable de todo eso.' },
  { id: 'studio',     nombre: 'Studio Creativo',              icono: Palette,         estado: 'en-activacion', grupo: 'extra',
    descripcion: 'Sandbox de generación de piezas: del brief a las variantes por formato, con su prueba A/B.' },
  { id: 'academia',   nombre: 'Academia',                     icono: GraduationCap,   estado: 'en-activacion', grupo: 'extra',
    descripcion: 'Rutas de capacitación del AI Acceleration Lab México para equipos de medios, creatividad y datos.' },
];

export const seccionesPrincipales = secciones.filter(s => s.grupo === 'principal');
export const seccionesExtra = secciones.filter(s => s.grupo === 'extra');

/** Color del punto de estado, tomado de la paleta de branding. */
export const colorEstado = (estado: EstadoSeccion): string => {
  const { colores } = brandingConfig;
  if (estado === 'activo') return colores.exito;
  if (estado === 'demo') return colores.advertencia;
  return colores.textoOscuro;
};

export const tituloEstado: Record<EstadoSeccion, string> = {
  'activo': 'Conectado a datos en vivo',
  'demo': 'Demo con datos estructurados',
  'en-activacion': 'En activación',
};
