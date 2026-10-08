// Datos mock de Facturación (servicios cerrados listos para cobro).
// Al conectar backend real se reemplaza por /api/facturacion, con salida a facturación/CRM.

export type EstatusFactura = 'Pendiente' | 'Facturado' | 'Enviado a CRM';

export interface ServicioFacturable {
  folio: string;
  cliente: string;
  tipo: string;
  fecha: string;
  monto: number;
  estatus: EstatusFactura;
}

export const SERVICIOS_FACTURABLES: ServicioFacturable[] = [
  { folio: 'SV-10450', cliente: 'Abarrotes Zona Industrial',          tipo: 'Ordinario',      fecha: '2026-10-08', monto: 2_400,  estatus: 'Pendiente' },
  { folio: 'SV-10449', cliente: 'Supermercado Genérico Plaza del Sol',   tipo: 'Extraordinario', fecha: '2026-10-08', monto: 8_900,  estatus: 'Pendiente' },
  { folio: 'SV-10439', cliente: 'Farmacia Genérica #212',     tipo: 'Recurrente',     fecha: '2026-10-07', monto: 1_850,  estatus: 'Facturado' },
  { folio: 'SV-10422', cliente: 'Banco Genérico Sucursal Centro',  tipo: 'Ordinario',      fecha: '2026-10-06', monto: 3_200,  estatus: 'Enviado a CRM' },
  { folio: 'SV-10410', cliente: 'Banco Comercial Sucursal Américas',        tipo: 'Recurrente',     fecha: '2026-10-05', monto: 2_750,  estatus: 'Facturado' },
  { folio: 'SV-10398', cliente: 'Clínica Genérica',       tipo: 'Extraordinario', fecha: '2026-10-04', monto: 4_100,  estatus: 'Pendiente' },
];
