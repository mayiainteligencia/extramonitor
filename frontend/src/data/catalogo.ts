// Conflictos de homologación del Catálogo Maestro. Vive aquí para que Tablero
// y la sección Catálogo lean la misma fuente. Dato simulado — fuente futura:
// motor de matching entre proveedores, actualizado en cada revisión humana.

export type TipoEntidad = 'anunciante' | 'marca' | 'medio';

export interface Conflicto {
  entidad: string;
  tipo: TipoEntidad;
  variantes: string[];
  proveedores: string[];
  estado: 'pendiente' | 'resuelto';
}

export const CONFLICTOS: Conflicto[] = [
  { entidad: 'Liverpool', tipo: 'anunciante', variantes: ['Liverpool', 'El Puerto de Liverpool', 'LIVERPOOL SAB'], proveedores: ['HR Media', 'Feed de licitación (piloto)'], estado: 'pendiente' },
  { entidad: 'BBVA México', tipo: 'anunciante', variantes: ['BBVA', 'BBVA Bancomer', 'BBVA México'], proveedores: ['HR Media'], estado: 'pendiente' },
  { entidad: 'Nissan', tipo: 'marca', variantes: ['Nissan', 'Nissan Mexicana'], proveedores: ['HR Media', 'Feed de licitación (piloto)'], estado: 'resuelto' },
  { entidad: 'Imagen Televisión', tipo: 'medio', variantes: ['Imagen TV', 'Grupo Imagen', 'Imagen Televisión'], proveedores: ['HR Media'], estado: 'resuelto' },
  { entidad: 'Coppel', tipo: 'anunciante', variantes: ['Coppel', 'Coppel S.A. de C.V.'], proveedores: ['HR Media'], estado: 'resuelto' },
  { entidad: 'AT&T México', tipo: 'marca', variantes: ['AT&T', 'AT&T México', 'ATT MX'], proveedores: ['HR Media', 'Feed de licitación (piloto)'], estado: 'pendiente' },
];
