// Datos mock de Oficiales de Seguridad (puestos, turnos, rondines).
// Al conectar backend real se reemplaza por /api/seguridad.

export type TurnoSeguridad = 'Matutino' | 'Vespertino' | 'Nocturno';
export type EstatusPuesto = 'Cubierto' | 'Descubierto' | 'En relevo';

export interface PuestoSeguridad {
  id: string;
  cliente: string;
  ubicacion: string;
  turno: TurnoSeguridad;
  oficial: string;
  estatus: EstatusPuesto;
  ultimoCheckIn: string;
}

export type EstatusRondin = 'Completado' | 'Con incidencia';

export interface Rondin {
  id: string;
  puesto: string;
  oficial: string;
  hora: string;
  estatus: EstatusRondin;
  nota?: string;
}

export const PUESTOS: PuestoSeguridad[] = [
  { id: 'PST-01', cliente: 'Banco Genérico Sucursal Centro',        ubicacion: 'Caseta principal', turno: 'Matutino',   oficial: 'Esteban Vera',    estatus: 'Cubierto',    ultimoCheckIn: '09:00' },
  { id: 'PST-02', cliente: 'Supermercado Genérico Plaza del Sol',   ubicacion: 'Acceso de carga',   turno: 'Vespertino', oficial: 'Rodrigo Díaz',    estatus: 'Cubierto',    ultimoCheckIn: '15:00' },
  { id: 'PST-03', cliente: 'Abarrotes Zona Industrial',             ubicacion: 'CEDIS - patio',      turno: 'Nocturno',   oficial: 'Ana Belén Ruiz',  estatus: 'En relevo',   ultimoCheckIn: '22:00' },
  { id: 'PST-04', cliente: 'Clínica Genérica',                      ubicacion: 'Vestíbulo principal', turno: 'Matutino',  oficial: '—',               estatus: 'Descubierto', ultimoCheckIn: '—' },
  { id: 'PST-05', cliente: 'Farmacia Genérica #212',                ubicacion: 'Caseta de acceso',   turno: 'Vespertino', oficial: 'Julio Camacho',   estatus: 'Cubierto',    ultimoCheckIn: '15:05' },
];

export const RONDINES: Rondin[] = [
  { id: 'RND-501', puesto: 'PST-01', oficial: 'Esteban Vera',   hora: '09:30', estatus: 'Completado' },
  { id: 'RND-500', puesto: 'PST-02', oficial: 'Rodrigo Díaz',   hora: '09:15', estatus: 'Completado' },
  { id: 'RND-499', puesto: 'PST-03', oficial: 'Ana Belén Ruiz', hora: '08:50', estatus: 'Con incidencia', nota: 'Puerta de montacargas sin candado, se reporta a mantenimiento.' },
  { id: 'RND-498', puesto: 'PST-05', oficial: 'Julio Camacho',  hora: '08:40', estatus: 'Completado' },
];
