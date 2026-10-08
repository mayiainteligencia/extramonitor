// Datos mock de Rutas y Flota. Al conectar backend real se reemplaza por /api/rutas y /api/flota.

export type EstatusRuta = 'Planeada' | 'En curso' | 'Completada';
export type DisponibilidadUnidad = 'Disponible' | 'En servicio' | 'Mantenimiento';

export interface Ruta {
  id: string;
  zona: string;
  servicios: string[];
  unidad: string;
  conductor: string;
  custodio: string;
  kmEstimado: number;
  estatus: EstatusRuta;
}

export interface Unidad {
  id: string;
  placas: string;
  tipo: 'Blindada' | 'Semi-blindada';
  disponibilidad: DisponibilidadUnidad;
  kilometraje: number;
  ultimoMantenimiento: string;
}

export const RUTAS: Ruta[] = [
  { id: 'RT-301', zona: 'Centro - Américas',    servicios: ['SV-10460', 'SV-10462'], unidad: 'U-08', conductor: 'Raúl Pérez',   custodio: 'Ismael Cortés', kmEstimado: 38, estatus: 'En curso' },
  { id: 'RT-302', zona: 'Zapopan Norte',         servicios: ['SV-10461', 'SV-10466'], unidad: 'U-03', conductor: 'Daniel Ruiz',  custodio: 'Marco Salas',   kmEstimado: 52, estatus: 'Planeada' },
  { id: 'RT-303', zona: 'Plaza del Sol',         servicios: ['SV-10463'],             unidad: 'U-05', conductor: 'Luis Gómez',   custodio: 'Víctor Reyes',  kmEstimado: 21, estatus: 'Planeada' },
  { id: 'RT-304', zona: 'Chapultepec - Américas', servicios: ['SV-10464', 'SV-10465'], unidad: 'U-02', conductor: 'Sergio Lima',  custodio: 'Omar Ibarra',   kmEstimado: 44, estatus: 'Completada' },
];

export const UNIDADES: Unidad[] = [
  { id: 'U-02', placas: 'JGT-2201', tipo: 'Blindada',       disponibilidad: 'En servicio',  kilometraje: 182_400, ultimoMantenimiento: '2026-09-02' },
  { id: 'U-03', placas: 'JGT-2203', tipo: 'Semi-blindada',  disponibilidad: 'Disponible',   kilometraje: 97_250,  ultimoMantenimiento: '2026-09-18' },
  { id: 'U-05', placas: 'JGT-2205', tipo: 'Blindada',       disponibilidad: 'Disponible',   kilometraje: 205_900, ultimoMantenimiento: '2026-08-27' },
  { id: 'U-06', placas: 'JGT-2206', tipo: 'Semi-blindada',  disponibilidad: 'Mantenimiento', kilometraje: 156_300, ultimoMantenimiento: '2026-10-05' },
  { id: 'U-08', placas: 'JGT-2208', tipo: 'Blindada',       disponibilidad: 'En servicio',  kilometraje: 133_700, ultimoMantenimiento: '2026-09-25' },
  { id: 'U-09', placas: 'JGT-2209', tipo: 'Semi-blindada',  disponibilidad: 'Disponible',   kilometraje: 88_100,  ultimoMantenimiento: '2026-09-11' },
  { id: 'U-11', placas: 'JGT-2211', tipo: 'Blindada',       disponibilidad: 'Disponible',   kilometraje: 174_050, ultimoMantenimiento: '2026-08-30' },
];
