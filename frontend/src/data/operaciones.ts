// Datos mock del Dashboard General de BBOX Security (operación de transporte de valores).
// Al conectar backend real, este archivo se reemplaza por llamadas a /api/operaciones/*.

export type EstatusServicio = 'Programado' | 'En ruta' | 'Atendido' | 'Cerrado' | 'No realizado';

export interface ServicioReciente {
  folio: string;
  cliente: string;
  tipo: 'Ordinario' | 'Recurrente' | 'Extraordinario';
  estatus: EstatusServicio;
  unidad: string;
  hora: string;
}

export interface IncidenciaReciente {
  folio: string;
  descripcion: string;
  servicio: string;
  severidad: 'Alta' | 'Media' | 'Baja';
  hora: string;
}

export interface PuntoSLA {
  dia: string;
  cumplimiento: number;
}

export const KPIS_HOY = {
  serviciosHoy: 128,
  cumplimientoSLA: 96.4,
  incidenciasAbiertas: 3,
  productividadPorUnidad: 7.2, // servicios promedio por unidad al día
};

export const SERVICIOS_POR_ESTATUS: { estatus: EstatusServicio; total: number }[] = [
  { estatus: 'Programado', total: 34 },
  { estatus: 'En ruta', total: 19 },
  { estatus: 'Atendido', total: 12 },
  { estatus: 'Cerrado', total: 61 },
  { estatus: 'No realizado', total: 2 },
];

export const SLA_7_DIAS: PuntoSLA[] = [
  { dia: 'Lun', cumplimiento: 95.1 },
  { dia: 'Mar', cumplimiento: 96.8 },
  { dia: 'Mié', cumplimiento: 94.2 },
  { dia: 'Jue', cumplimiento: 97.5 },
  { dia: 'Vie', cumplimiento: 93.6 },
  { dia: 'Sáb', cumplimiento: 98.0 },
  { dia: 'Dom', cumplimiento: 96.4 },
];

export const SERVICIOS_RECIENTES: ServicioReciente[] = [
  { folio: 'SV-10452', cliente: 'Banco Genérico Sucursal Centro', tipo: 'Ordinario',      estatus: 'En ruta',       unidad: 'U-08', hora: '09:40' },
  { folio: 'SV-10451', cliente: 'Farmacia Genérica #212',     tipo: 'Recurrente',     estatus: 'Atendido',      unidad: 'U-03', hora: '09:15' },
  { folio: 'SV-10450', cliente: 'Abarrotes Zona Industrial',          tipo: 'Ordinario',      estatus: 'Cerrado',       unidad: 'U-11', hora: '08:50' },
  { folio: 'SV-10449', cliente: 'Supermercado Genérico Plaza del Sol',   tipo: 'Extraordinario', estatus: 'Cerrado',       unidad: 'U-05', hora: '08:30' },
  { folio: 'SV-10448', cliente: 'Banco Comercial Sucursal Américas',        tipo: 'Recurrente',     estatus: 'No realizado', unidad: 'U-02', hora: '08:10' },
  { folio: 'SV-10447', cliente: 'Tienda de Conveniencia Chapultepec',   tipo: 'Ordinario',      estatus: 'Programado',    unidad: 'U-09', hora: '10:20' },
];

export const INCIDENCIAS_RECIENTES: IncidenciaReciente[] = [
  { folio: 'INC-0231', descripcion: 'Retraso por cierre vial',        servicio: 'SV-10448', severidad: 'Media', hora: '08:05' },
  { folio: 'INC-0230', descripcion: 'Documentación incompleta',       servicio: 'SV-10439', severidad: 'Baja',  hora: '07:48' },
  { folio: 'INC-0229', descripcion: 'Unidad con falla mecánica menor', servicio: 'SV-10422', severidad: 'Alta',  hora: '07:10' },
];
