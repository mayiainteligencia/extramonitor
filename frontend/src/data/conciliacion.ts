// Casos de Conciliación. Vive aquí para que Tablero y la sección Conciliación
// lean la misma fuente. Dato simulado — la mecánica es real: el clip con
// timestamp de Verificación On-Air es la evidencia que resuelve la disputa
// entre lo que el medio dice haber transmitido y lo que la agencia dice haber
// contratado. Fuente futura: Motor de Ingesta (etapa Cruce de Entregas) +
// Verificación On-Air. Granularidad: por caso, actualizado por evento.

export type EstadoCaso = 'abierto' | 'en-revision' | 'resuelto';

export interface CasoConciliacion {
  id: string;
  television: string;   // id en TELEVISORAS (data/media.ts)
  agencia: string;       // id en AGENCIAS (data/media.ts)
  spot: string;
  plaza: string;
  reportadoMedio: number;   // spots que el medio dice haber transmitido
  reportadoAgencia: number; // spots que la agencia dice haber contratado y esperaba
  deltaMXN: number;
  evidencia: boolean;       // hay clip de Verificación On-Air adjunto
  estado: EstadoCaso;
  abiertoDesdeDias: number;
}

export const CASOS: CasoConciliacion[] = [
  { id: 'CC-101', television: 'TELEVISA', agencia: 'HAVAS',    spot: 'Spot 20" — bloque matutino', plaza: 'Ciudad de México', reportadoMedio: 42, reportadoAgencia: 48, deltaMXN: 87_000, evidencia: true,  estado: 'abierto',     abiertoDesdeDias: 2 },
  { id: 'CC-102', television: 'AZTECA',   agencia: 'GROUPM',   spot: 'Spot 30" — prime time',      plaza: 'Nuevo León',       reportadoMedio: 30, reportadoAgencia: 30, deltaMXN: 0,       evidencia: true,  estado: 'resuelto',    abiertoDesdeDias: 6 },
  { id: 'CC-103', television: 'IMAGEN',   agencia: 'PUBLICIS', spot: 'Spot 15" — noticiero',        plaza: 'Jalisco',          reportadoMedio: 18, reportadoAgencia: 24, deltaMXN: 54_000, evidencia: true,  estado: 'en-revision', abiertoDesdeDias: 5 },
  { id: 'CC-104', television: 'TELEVISA', agencia: 'OMG',      spot: 'Spot 20" — fin de semana',    plaza: 'Puebla',           reportadoMedio: 12, reportadoAgencia: 16, deltaMXN: 38_000, evidencia: false, estado: 'abierto',     abiertoDesdeDias: 1 },
  { id: 'CC-105', television: 'AZTECA',   agencia: 'DENTSU',   spot: 'Spot 30" — franja infantil',  plaza: 'Estado de México', reportadoMedio: 22, reportadoAgencia: 20, deltaMXN: 0,       evidencia: true,  estado: 'resuelto',    abiertoDesdeDias: 9 },
  { id: 'CC-106', television: 'IMAGEN',   agencia: 'IPG',      spot: 'Spot 20" — deportivo',        plaza: 'Guanajuato',       reportadoMedio: 15, reportadoAgencia: 21, deltaMXN: 41_000, evidencia: false, estado: 'en-revision', abiertoDesdeDias: 8 },
  { id: 'CC-107', television: 'TELEVISA', agencia: 'PUBLICIS', spot: 'Spot 15" — vespertino',       plaza: 'Veracruz',         reportadoMedio: 20, reportadoAgencia: 27, deltaMXN: 61_000, evidencia: false, estado: 'abierto',     abiertoDesdeDias: 16 },
  { id: 'CC-108', television: 'AZTECA',   agencia: 'HAVAS',    spot: 'Spot 20" — nocturno',         plaza: 'Sonora',           reportadoMedio: 14, reportadoAgencia: 14, deltaMXN: 0,       evidencia: true,  estado: 'resuelto',    abiertoDesdeDias: 12 },
];
