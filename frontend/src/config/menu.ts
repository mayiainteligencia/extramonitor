import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Route,
  Navigation,
  ShieldHalf,
  Siren,
  ShieldCheck,
  Truck,
  AlertTriangle,
  BarChart3,
  Receipt,
  Globe,
  UserCog,
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
  { id: 'dashboard',   nombre: 'Dashboard General',    icono: LayoutDashboard, estado: 'demo', grupo: 'principal',
    descripcion: 'Vista de arranque: servicios del día, productividad, cumplimiento de SLA e incidencias abiertas.' },
  { id: 'clientes',    nombre: 'Clientes',              icono: Users,           estado: 'demo', grupo: 'principal',
    descripcion: 'Prospección y alta de clientes: sucursales, domicilios, contactos, condiciones de servicio y evaluación de riesgo.' },
  { id: 'servicios',   nombre: 'Servicios',             icono: CalendarClock,   estado: 'demo', grupo: 'principal',
    descripcion: 'Programación de servicios ordinarios, recurrentes y extraordinarios, con cancelaciones y reprogramaciones.' },
  { id: 'rutas',       nombre: 'Rutas y Flota',         icono: Route,           estado: 'demo', grupo: 'principal',
    descripcion: 'Planeación de rutas, asignación de unidad y tripulación, optimización y administración de flota (kilometraje, disponibilidad, mantenimiento).' },
  { id: 'operacion',   nombre: 'Operación en Vivo',     icono: Navigation,      estado: 'demo', grupo: 'principal',
    descripcion: 'Seguimiento GPS, geocercas de llegada/salida y estatus del servicio: Programado → En ruta → Atendido → Cerrado / No realizado.' },
  { id: 'seguridad',   nombre: 'Oficiales de Seguridad', icono: ShieldHalf,     estado: 'demo', grupo: 'principal',
    descripcion: 'Puestos de seguridad por cliente, turnos y oficial asignado, con check-in y rondines registrados.' },
  { id: 'custodia',    nombre: 'Custodias',             icono: ShieldCheck,     estado: 'demo', grupo: 'principal',
    descripcion: 'Custodia de valores y mercancía de alto riesgo: trazabilidad de recepción, traslado y entrega, con responsables, eventos y evidencia digital.' },
  { id: 'alarmas',     nombre: 'Monitoreo de Alarmas',  icono: Siren,           estado: 'demo', grupo: 'principal',
    descripcion: 'Central de monitoreo de alarmas: eventos de intrusión, pánico, incendio y falla técnica, con tiempo de respuesta y despacho de unidad.' },
  { id: 'transporte',  nombre: 'Transporte de Mercancías', icono: Truck,        estado: 'demo', grupo: 'principal',
    descripcion: 'Embarques de carga general (no valores): origen, destino, unidad asignada y estatus del envío.' },
  { id: 'incidencias', nombre: 'Incidencias',           icono: AlertTriangle,   estado: 'demo', grupo: 'principal',
    descripcion: 'Registro y seguimiento de excepciones operativas.' },
  { id: 'analitica',   nombre: 'Analítica & SLA',       icono: BarChart3,       estado: 'demo', grupo: 'principal',
    descripcion: 'Cumplimiento de SLA por cliente y rentabilidad por cliente, ruta, unidad y tipo de servicio.' },
  { id: 'facturacion', nombre: 'Facturación',           icono: Receipt,         estado: 'demo', grupo: 'extra',
    descripcion: 'Servicios cerrados listos para generar el cobro, con salida hacia facturación, CRM y otras plataformas.' },
  { id: 'portal',      nombre: 'Portal del Cliente',    icono: Globe,           estado: 'demo', grupo: 'extra',
    descripcion: 'Acceso del cliente a sus servicios, evidencias y reportes automáticos.' },
  { id: 'usuarios',    nombre: 'Usuarios y Auditoría',  icono: UserCog,         estado: 'demo', grupo: 'extra',
    descripcion: 'Perfiles con permisos diferenciados (Operaciones, Administración, Supervisión) e historial no alterable de movimientos.' },
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
