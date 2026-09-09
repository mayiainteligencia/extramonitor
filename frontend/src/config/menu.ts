import {
  Radio,
  Cable,
  ClipboardList,
  MapPin,
  Globe,
  GraduationCap,
  Network,
  BookOpen,
  Scale,
  ShieldCheck,
  Tv,
  Users2,
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
//
// Solo "verificacion" es dato real (monitoreo de radio en vivo). El resto es
// demo o está en activación — ACAM audita proveedores, así que inflar el
// estado de una sección propia se paga carísimo.
export const secciones: ItemMenu[] = [
  { id: 'verificacion', nombre: 'Verificación On-Air',        icono: Radio,        estado: 'activo',        grupo: 'principal',
    descripcion: 'Evidencia auditable de que un spot salió al aire: escucha las emisoras, transcribe y deja el clip con timestamp que resuelve una disputa entre medio y agencia.' },
  { id: 'partners',     nombre: 'Hub de Partners',            icono: Network,      estado: 'en-activacion', grupo: 'principal',
    descripcion: 'Ingesta de los proveedores de medición (HR Media y el futuro ganador de licitación): estado de entrega, cobertura, frescura del dato y última sincronización de cada uno.' },
  { id: 'catalogo',     nombre: 'Catálogo Maestro',           icono: BookOpen,     estado: 'demo',          grupo: 'principal',
    descripcion: 'Diccionario único de anunciantes, marcas, categorías y medios, con las reglas de homologación entre proveedores y los conflictos pendientes de resolver.' },
  { id: 'conciliacion', nombre: 'Conciliación',                icono: Scale,        estado: 'demo',          grupo: 'principal',
    descripcion: 'Cuando una televisora y una agencia difieren sobre si un spot salió al aire, aquí se resuelve: casos abiertos, delta entre lo reportado por cada lado, evidencia y estado de resolución.' },
  { id: 'inversion',    nombre: 'Inversión Publicitaria',      icono: ClipboardList, estado: 'demo',         grupo: 'principal',
    descripcion: 'Reporte de industria: spend por medio, categoría y anunciante entre los 9 asociados, con su evolución por periodo.' },
  { id: 'ingesta',      nombre: 'Motor de Ingesta y Normalización', icono: Cable,   estado: 'en-activacion', grupo: 'principal',
    descripcion: 'El pipeline que recibe, valida y homologa el dato de cada proveedor antes de publicarlo, con linaje de cada cifra de origen a reporte.' },
  { id: 'trazabilidad', nombre: 'Trazabilidad y Auditoría',    icono: ShieldCheck,  estado: 'en-activacion', grupo: 'principal',
    descripcion: 'Cada cifra con su origen, proveedor, timestamp y versión de metodología, con exportación de paquete de auditoría en el formato que ya reconocen 3m3a y RSMB.' },
  { id: 'ooh',          nombre: 'Censo OOH',                   icono: MapPin,       estado: 'demo',          grupo: 'principal',
    descripcion: 'Inventario exterior real: 775 soportes con tarifa y disponibilidad, y el circuito medido con su audiencia por edad y NSE. ACAM no planea circuitos, ACAM los cuenta.' },
  { id: 'digital',      nombre: 'Monitor Digital',             icono: Globe,        estado: 'en-activacion', grupo: 'principal',
    descripcion: 'Tráfico, sentimiento en redes y visibilidad en buscadores y en respuestas de IA (GEO/AEO), sin el terreno de e-commerce y marketplaces que no le toca a ACAM.' },
  { id: 'ctv',          nombre: 'CTV Spend',                   icono: Tv,           estado: 'en-activacion', grupo: 'extra',
    descripcion: 'Inventario, ocurrencias e inversión estimada en CTV — la prioridad número uno declarada por ACAM para evolucionar la medición de contenido.' },
  { id: 'influencers',  nombre: 'Influencers',                 icono: Users2,       estado: 'en-activacion', grupo: 'extra',
    descripcion: 'Medición de spend e impacto en influencers: un hueco que hoy nadie mide con método y que no compite con la licitación de monitoreo de ACAM.' },
  { id: 'academia',     nombre: 'Academia',                    icono: GraduationCap, estado: 'en-activacion', grupo: 'extra',
    descripcion: 'Rutas de capacitación en metodología de medición para los equipos de los 9 asociados — televisoras y agencias por igual.' },
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
