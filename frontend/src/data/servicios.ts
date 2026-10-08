// Datos mock de Programación de Servicios. Al conectar backend real se reemplaza por /api/servicios.

export type TipoServicio = 'Ordinario' | 'Recurrente' | 'Extraordinario';
export type EstatusProgramacion = 'Programado' | 'Confirmado' | 'Cancelado' | 'Reprogramado';

export interface ServicioProgramado {
  folio: string;
  cliente: string;
  tipo: TipoServicio;
  fecha: string;
  hora: string;
  unidad: string;
  estatus: EstatusProgramacion;
  notas?: string;
}

export const SERVICIOS_PROGRAMADOS: ServicioProgramado[] = [
  { folio: 'SV-10460', cliente: 'Banco Genérico Sucursal Centro',    tipo: 'Ordinario',      fecha: '2026-10-09', hora: '08:00', unidad: 'U-08', estatus: 'Confirmado' },
  { folio: 'SV-10461', cliente: 'Farmacia Genérica #212',       tipo: 'Recurrente',     fecha: '2026-10-09', hora: '18:00', unidad: 'U-03', estatus: 'Programado' },
  { folio: 'SV-10462', cliente: 'Abarrotes Zona Industrial',            tipo: 'Ordinario',      fecha: '2026-10-09', hora: '11:30', unidad: 'U-11', estatus: 'Programado' },
  { folio: 'SV-10463', cliente: 'Supermercado Genérico Plaza del Sol',     tipo: 'Extraordinario', fecha: '2026-10-10', hora: '07:00', unidad: 'U-05', estatus: 'Confirmado', notas: 'Quincena — 2 unidades blindadas' },
  { folio: 'SV-10464', cliente: 'Banco Comercial Sucursal Américas',          tipo: 'Recurrente',     fecha: '2026-10-10', hora: '09:15', unidad: 'U-02', estatus: 'Reprogramado', notas: 'Movido de 08:10 por cierre vial' },
  { folio: 'SV-10465', cliente: 'Tienda de Conveniencia Chapultepec',     tipo: 'Ordinario',      fecha: '2026-10-10', hora: '10:20', unidad: 'U-09', estatus: 'Cancelado', notas: 'Cliente inactivo' },
  { folio: 'SV-10466', cliente: 'Farmacia Genérica #340',       tipo: 'Recurrente',     fecha: '2026-10-11', hora: '18:00', unidad: 'U-03', estatus: 'Programado' },
  { folio: 'SV-10467', cliente: 'Clínica Genérica',         tipo: 'Extraordinario', fecha: '2026-10-11', hora: '13:00', unidad: 'U-06', estatus: 'Programado', notas: 'Primer servicio — prospecto en activación' },
];
