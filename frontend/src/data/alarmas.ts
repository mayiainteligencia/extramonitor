// Datos mock de Monitoreo de Alarmas (central de monitoreo 24/7).
// Al conectar backend real se reemplaza por /api/alarmas.

export type TipoAlarma = 'Intrusión' | 'Pánico' | 'Incendio' | 'Falla técnica';
export type EstatusAlarma = 'Activa' | 'Atendida' | 'Falsa alarma';

export interface EventoAlarma {
  id: string;
  cliente: string;
  ubicacion: string;
  tipo: TipoAlarma;
  estatus: EstatusAlarma;
  hora: string;
  tiempoRespuestaMin: number | null;
}

export const EVENTOS_ALARMA: EventoAlarma[] = [
  { id: 'ALM-3301', cliente: 'Banco Genérico Sucursal Centro',  ubicacion: 'Bóveda',          tipo: 'Pánico',         estatus: 'Activa',       hora: '09:48', tiempoRespuestaMin: null },
  { id: 'ALM-3300', cliente: 'Farmacia Genérica #340',          ubicacion: 'Acceso trasero',  tipo: 'Intrusión',      estatus: 'Atendida',     hora: '03:12', tiempoRespuestaMin: 6 },
  { id: 'ALM-3299', cliente: 'Clínica Genérica',                ubicacion: 'Farmacia interna', tipo: 'Falla técnica', estatus: 'Atendida',     hora: '23:40', tiempoRespuestaMin: 14 },
  { id: 'ALM-3298', cliente: 'Abarrotes Zona Industrial',       ubicacion: 'CEDIS - nave 2',  tipo: 'Intrusión',      estatus: 'Falsa alarma', hora: '21:05', tiempoRespuestaMin: 9 },
  { id: 'ALM-3297', cliente: 'Supermercado Genérico Plaza del Sol', ubicacion: 'Área de cajas', tipo: 'Incendio',     estatus: 'Atendida',     hora: '18:22', tiempoRespuestaMin: 5 },
];
