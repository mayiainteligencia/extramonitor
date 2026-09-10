// Estado de los proveedores de medición que alimentan a ACAM. Vive aquí (no
// dentro de un componente) para que Tablero y Hub de Partners lean la misma
// fuente. Dato simulado — en producción esto es el heartbeat de ingesta de
// cada proveedor (HR Media hoy, el ganador de licitación mañana), actualizado
// por sincronización.

export type EstadoEntrega = 'al-dia' | 'con-retraso' | 'pendiente';

export interface Proveedor {
  id: string;
  nombre: string;
  servicio: string;
  estado: EstadoEntrega;
  coberturaPct: number;
  frescuraHoras: number;
  ultimaSync: string;
  nota: string;
}

export const PROVEEDORES: Proveedor[] = [
  {
    id: 'hrmedia', nombre: 'HR Media', servicio: 'Medición de audiencias (TV, Radio, Digital)',
    estado: 'al-dia', coberturaPct: 94, frescuraHoras: 6, ultimaSync: 'hoy 06:40',
    nota: 'Proveedor de medición contratado por ACAM. Entrega diaria por feed.',
  },
  {
    id: 'licitacion', nombre: 'Ganador de licitación (pendiente)', servicio: 'Monitoreo de medios tradicionales y CTV',
    estado: 'pendiente', coberturaPct: 0, frescuraHoras: -1, ultimaSync: '—',
    nota: 'Licitación de monitoreo de medios e inversión publicitaria en curso — prioridad #2 de ACAM. Este renglón se activa cuando haya proveedor asignado.',
  },
];

/** Entrega diaria por proveedor, últimos 14 días. `entregado: null` = proveedor aún no activo ese día. */
export interface EntregaDia {
  dia: string;   // YYYY-MM-DD
  proveedorId: string;
  entregado: boolean | null;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const DIAS = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return d.toISOString().slice(0, 10);
});

export const HISTORIAL_ENTREGAS: EntregaDia[] = DIAS.flatMap(dia =>
  PROVEEDORES.map(p => ({
    dia,
    proveedorId: p.id,
    entregado: p.estado === 'pendiente' ? null : hash(dia + p.id) % 10 !== 0, // ~90% de entregas a tiempo
  })),
);
