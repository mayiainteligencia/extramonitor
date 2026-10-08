// Datos mock de Transporte de Mercancías (carga general, distinta de Custodias/valores).
// Al conectar backend real se reemplaza por /api/transporte.

export type EstatusEmbarque = 'En origen' | 'En tránsito' | 'Entregado' | 'Incidencia';

export interface Embarque {
  folio: string;
  cliente: string;
  tipoCarga: string;
  origen: string;
  destino: string;
  unidad: string;
  estatus: EstatusEmbarque;
  horaSalida: string;
  horaEstimadaLlegada: string;
}

export const EMBARQUES: Embarque[] = [
  { folio: 'TM-7801', cliente: 'Supermercado Genérico Plaza del Sol', tipoCarga: 'Mercancía general', origen: 'CEDIS Guadalajara', destino: 'Hiper Plaza del Sol',      unidad: 'U-09', estatus: 'En tránsito', horaSalida: '08:00', horaEstimadaLlegada: '09:30' },
  { folio: 'TM-7800', cliente: 'Abarrotes Zona Industrial',           tipoCarga: 'Abarrotes',          origen: 'CEDIS Zona Industrial', destino: 'Sucursal Periférico', unidad: 'U-11', estatus: 'Entregado',   horaSalida: '07:10', horaEstimadaLlegada: '08:15' },
  { folio: 'TM-7799', cliente: 'Farmacia Genérica #212',               tipoCarga: 'Insumos médicos',    origen: 'Almacén Zapopan',        destino: 'Sucursal #212',       unidad: 'U-03', estatus: 'En origen',   horaSalida: '10:30', horaEstimadaLlegada: '11:45' },
  { folio: 'TM-7798', cliente: 'Clínica Genérica',                     tipoCarga: 'Equipo médico',      origen: 'Proveedor Guadalajara',  destino: 'Hospital Genérico',   unidad: 'U-06', estatus: 'Incidencia',  horaSalida: '06:45', horaEstimadaLlegada: '08:00' },
];
