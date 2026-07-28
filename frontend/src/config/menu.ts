import {
  LayoutDashboard,
  Radio,
  BrainCircuit,
  Command,
  ClipboardList,
  Bell,
  Globe,
  Vote,
  Shield,
  Code2,
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
  { id: 'dashboard',      nombre: 'Dashboard General',      icono: LayoutDashboard, estado: 'demo',          grupo: 'principal' },
  { id: 'monitor',        nombre: 'Monitor de Medios',      icono: Radio,           estado: 'activo',        grupo: 'principal' },
  { id: 'monitoria',      nombre: 'Cerebro Electoral',      icono: BrainCircuit,    estado: 'en-activacion', grupo: 'principal' },
  { id: 'comando',        nombre: 'Comando Central',        icono: Command,         estado: 'demo',          grupo: 'principal' },
  { id: 'resultados',     nombre: 'Resultados',             icono: ClipboardList,   estado: 'demo',          grupo: 'principal' },
  { id: 'alertas',        nombre: 'Alertas',                icono: Bell,            estado: 'demo',          grupo: 'principal' },
  { id: 'digital',        nombre: 'Monitor Digital',        icono: Globe,           estado: 'en-activacion', grupo: 'principal' },
  { id: 'electoral',      nombre: 'Inteligencia Electoral', icono: Vote,            estado: 'en-activacion', grupo: 'principal' },
  { id: 'ciberseguridad', nombre: 'CiberSeguridad',         icono: Shield,          estado: 'en-activacion', grupo: 'extra' },
  { id: 'playground',     nombre: 'Playground',             icono: Code2,           estado: 'en-activacion', grupo: 'extra' },
  { id: 'academia',       nombre: 'Academia',               icono: GraduationCap,   estado: 'en-activacion', grupo: 'extra' },
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
