// Datos mock de Analítica & SLA (cumplimiento por cliente, rentabilidad por dimensión).
// Al conectar backend real se reemplaza por /api/analitica.

export interface SLACliente {
  cliente: string;
  cumplimiento: number;
  servicios: number;
}

export interface RentabilidadItem {
  nombre: string;
  ingreso: number;
  costo: number;
}

export type DimensionRentabilidad = 'Cliente' | 'Ruta' | 'Unidad' | 'Tipo de servicio';

export const SLA_POR_CLIENTE: SLACliente[] = [
  { cliente: 'Banco Genérico',            cumplimiento: 98.2, servicios: 142 },
  { cliente: 'Farmacia Genérica',    cumplimiento: 96.5, servicios: 118 },
  { cliente: 'Abarrotes Zona Industrial',    cumplimiento: 94.1, servicios: 96 },
  { cliente: 'Supermercado Genérico Plaza',     cumplimiento: 91.8, servicios: 54 },
  { cliente: 'Banco Comercial Américas',           cumplimiento: 88.4, servicios: 61 },
  { cliente: 'Tienda de Conveniencia',         cumplimiento: 85.0, servicios: 22 },
];

export const RENTABILIDAD: Record<DimensionRentabilidad, RentabilidadItem[]> = {
  Cliente: [
    { nombre: 'Banco Genérico',         ingreso: 412_000, costo: 268_000 },
    { nombre: 'Farmacia Genérica', ingreso: 298_000, costo: 215_000 },
    { nombre: 'Abarrotes Zona Industrial', ingreso: 186_000, costo: 149_000 },
    { nombre: 'Supermercado Genérico Plaza',  ingreso: 154_000, costo: 118_000 },
    { nombre: 'Banco Comercial Américas',        ingreso: 121_000, costo: 104_000 },
  ],
  Ruta: [
    { nombre: 'Centro - Américas',     ingreso: 168_000, costo: 112_000 },
    { nombre: 'Zapopan Norte',         ingreso: 142_000, costo: 101_000 },
    { nombre: 'Plaza del Sol',         ingreso: 96_000,  costo: 74_000 },
    { nombre: 'Chapultepec - Américas', ingreso: 88_000, costo: 71_000 },
  ],
  Unidad: [
    { nombre: 'U-08', ingreso: 134_000, costo: 89_000 },
    { nombre: 'U-03', ingreso: 121_000, costo: 86_000 },
    { nombre: 'U-05', ingreso: 112_000, costo: 84_000 },
    { nombre: 'U-11', ingreso: 98_000,  costo: 73_000 },
    { nombre: 'U-02', ingreso: 87_000,  costo: 79_000 },
  ],
  'Tipo de servicio': [
    { nombre: 'Ordinario',      ingreso: 310_000, costo: 224_000 },
    { nombre: 'Recurrente',     ingreso: 268_000, costo: 182_000 },
    { nombre: 'Extraordinario', ingreso: 164_000, costo: 118_000 },
  ],
};
