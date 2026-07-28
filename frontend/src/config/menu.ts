import {
  LayoutDashboard,
  Radio,
  BrainCircuit,
  Command,
  ClipboardList,
  Bell,
  Globe,
  Route,
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
}

// Fuente única del menú: Sidebar, ResponsiveLayout y el switch de App.tsx
// se alimentan de este array. Cualquier sección nueva se agrega aquí.
export const secciones: ItemMenu[] = [
  { id: 'warroom',    nombre: 'War Room de Cliente',          icono: LayoutDashboard, estado: 'demo',          grupo: 'principal' },
  { id: 'testigos',   nombre: 'Testigos IA',                  icono: Radio,           estado: 'activo',        grupo: 'principal' },
  { id: 'cerebro',    nombre: 'Cerebro Orquestador',          icono: BrainCircuit,    estado: 'en-activacion', grupo: 'principal' },
  { id: 'comando',    nombre: 'Comando de Campaña',           icono: Command,         estado: 'demo',          grupo: 'principal' },
  { id: 'investment', nombre: 'Investment Value IA',          icono: ClipboardList,   estado: 'demo',          grupo: 'principal' },
  { id: 'alertas',    nombre: 'Alertas de Marca',             icono: Bell,            estado: 'demo',          grupo: 'principal' },
  { id: 'digital',    nombre: 'Monitor Digital & E-Commerce', icono: Globe,           estado: 'en-activacion', grupo: 'principal' },
  { id: 'journey',    nombre: 'Journey Intelligence',         icono: Route,           estado: 'en-activacion', grupo: 'principal' },
  { id: 'adfraud',    nombre: 'Ad Fraud & Brand Safety',      icono: ShieldAlert,     estado: 'en-activacion', grupo: 'extra' },
  { id: 'studio',     nombre: 'Studio Creativo',              icono: Palette,         estado: 'en-activacion', grupo: 'extra' },
  { id: 'academia',   nombre: 'Academia',                     icono: GraduationCap,   estado: 'en-activacion', grupo: 'extra' },
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
