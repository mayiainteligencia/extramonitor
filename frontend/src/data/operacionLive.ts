// Datos mock de Operación en Vivo (GPS, geocercas, pipeline de estatus).
// Al conectar el proveedor GPS real se reemplaza por /api/operacion/vivo (WS o polling).

export type EstatusPipeline = 'Programado' | 'En ruta' | 'Atendido' | 'Cerrado' | 'No realizado';
export type TipoEventoGeocerca = 'Entrada' | 'Salida';

export interface ServicioPipeline {
  folio: string;
  cliente: string;
  unidad: string;
  estatus: EstatusPipeline;
  hora: string;
}

export interface UnidadEnVivo {
  unidad: string;
  cliente: string;
  velocidad: number;
  ultimaActualizacion: string;
}

export interface EventoGeocerca {
  id: string;
  unidad: string;
  cliente: string;
  tipo: TipoEventoGeocerca;
  hora: string;
}

export const PIPELINE: EstatusPipeline[] = ['Programado', 'En ruta', 'Atendido', 'Cerrado', 'No realizado'];

export const SERVICIOS_PIPELINE: ServicioPipeline[] = [
  { folio: 'SV-10468', cliente: 'Abarrotes Zona Industrial',          unidad: 'U-11', estatus: 'Programado', hora: '11:30' },
  { folio: 'SV-10469', cliente: 'Farmacia Genérica #212',     unidad: 'U-03', estatus: 'Programado', hora: '18:00' },
  { folio: 'SV-10460', cliente: 'Banco Genérico Sucursal Centro',  unidad: 'U-08', estatus: 'En ruta',    hora: '09:42' },
  { folio: 'SV-10463', cliente: 'Supermercado Genérico Plaza del Sol',   unidad: 'U-05', estatus: 'En ruta',    hora: '09:38' },
  { folio: 'SV-10451', cliente: 'Farmacia Genérica #212',     unidad: 'U-03', estatus: 'Atendido',   hora: '09:15' },
  { folio: 'SV-10450', cliente: 'Abarrotes Zona Industrial',          unidad: 'U-11', estatus: 'Cerrado',    hora: '08:50' },
  { folio: 'SV-10449', cliente: 'Supermercado Genérico Plaza del Sol',   unidad: 'U-05', estatus: 'Cerrado',    hora: '08:30' },
  { folio: 'SV-10448', cliente: 'Banco Comercial Sucursal Américas',        unidad: 'U-02', estatus: 'No realizado', hora: '08:10' },
];

export const UNIDADES_EN_VIVO: UnidadEnVivo[] = [
  { unidad: 'U-08', cliente: 'Banco Genérico Sucursal Centro', velocidad: 38, ultimaActualizacion: 'hace 12 s' },
  { unidad: 'U-05', cliente: 'Supermercado Genérico Plaza del Sol',   velocidad: 0,  ultimaActualizacion: 'hace 4 s (detenida)' },
  { unidad: 'U-03', cliente: 'Farmacia Genérica #212',     velocidad: 22, ultimaActualizacion: 'hace 30 s' },
];

export const EVENTOS_GEOCERCA: EventoGeocerca[] = [
  { id: 'GEO-901', unidad: 'U-08', cliente: 'Banco Genérico Sucursal Centro', tipo: 'Entrada', hora: '09:40' },
  { id: 'GEO-900', unidad: 'U-11', cliente: 'Abarrotes Zona Industrial',        tipo: 'Salida',  hora: '08:52' },
  { id: 'GEO-899', unidad: 'U-11', cliente: 'Abarrotes Zona Industrial',        tipo: 'Entrada', hora: '08:44' },
  { id: 'GEO-898', unidad: 'U-05', cliente: 'Supermercado Genérico Plaza del Sol', tipo: 'Entrada', hora: '08:28' },
  { id: 'GEO-897', unidad: 'U-02', cliente: 'Banco Comercial Sucursal Américas',      tipo: 'Salida',  hora: '08:12' },
];
