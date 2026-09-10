// Capa de datos de industria para ACAM. Mock determinista (misma salida en
// cada carga) construido sobre las 32 entidades de data/mexicoPaths.ts, que
// aquí se leen como PLAZAS / mercados. Todo es DATO SIMULADO — no son cifras
// oficiales de ACAM ni de HR Media: sirven para mostrar la forma del reporte,
// no su contenido real.
//
// A diferencia del tablero de una agencia, aquí no hay "cliente": el reporte
// es de industria, balanceado entre los 9 asociados (3 televisoras que venden,
// 6 agencias que compran).
//
// ponytail: todo se calcula al importar el módulo (32 plazas × 3 periodos);
// si el catálogo creciera a nivel municipio, mover a un JSON precomputado.

export type TipoAsociado = 'television' | 'agencia';

export interface Asociado {
  id: string;
  nombre: string;
  tipo: TipoAsociado;
  color: string;
}

// Los 9 asociados de ACAM, en dos bloques con intereses opuestos. Orden
// alfabético dentro de cada bloque — nadie va primero por ser quien es.
export const ASOCIADOS: Asociado[] = [
  { id: 'AZTECA',   nombre: 'TV Azteca',          tipo: 'television', color: '#0F1E4D' },
  { id: 'IMAGEN',   nombre: 'Imagen Televisión',  tipo: 'television', color: '#1E3A8A' },
  { id: 'TELEVISA', nombre: 'Televisa Univision', tipo: 'television', color: '#3B5BDB' },
  { id: 'DENTSU',   nombre: 'dentsu',             tipo: 'agencia',    color: '#334155' },
  { id: 'GROUPM',   nombre: 'GroupM',             tipo: 'agencia',    color: '#475569' },
  { id: 'HAVAS',    nombre: 'Havas',              tipo: 'agencia',    color: '#64748B' },
  { id: 'IPG',      nombre: 'IPG Mediabrands',    tipo: 'agencia',    color: '#94A3B8' },
  { id: 'OMG',      nombre: 'OMG',                tipo: 'agencia',    color: '#0EA5E9' },
  { id: 'PUBLICIS', nombre: 'Publicis',           tipo: 'agencia',    color: '#0284C7' },
];

export const TELEVISORAS = ASOCIADOS.filter(a => a.tipo === 'television');
export const AGENCIAS = ASOCIADOS.filter(a => a.tipo === 'agencia');

export const ASOCIADO_COLOR: Record<string, string> = Object.fromEntries(ASOCIADOS.map(a => [a.id, a.color]));
export const ASOCIADO_NOMBRE: Record<string, string> = Object.fromEntries(ASOCIADOS.map(a => [a.id, a.nombre]));

/* ─────────────────────────── Anunciantes (dato simulado) ─────────────────────────── */

export interface Anunciante {
  nombre: string;
  categoria: string;
  agencia: string;   // id en AGENCIAS que gestiona la cuenta
}

export const ANUNCIANTES: Anunciante[] = [
  { nombre: 'Liverpool',      categoria: 'Retail departamental',  agencia: 'HAVAS' },
  { nombre: 'Coppel',         categoria: 'Retail departamental',  agencia: 'PUBLICIS' },
  { nombre: 'Banorte',        categoria: 'Servicios financieros', agencia: 'GROUPM' },
  { nombre: 'BBVA México',    categoria: 'Servicios financieros', agencia: 'DENTSU' },
  { nombre: 'Cinépolis',      categoria: 'Entretenimiento',       agencia: 'OMG' },
  { nombre: 'Aeroméxico',     categoria: 'Aviación',              agencia: 'IPG' },
  { nombre: 'Hyundai',        categoria: 'Automotriz',            agencia: 'PUBLICIS' },
  { nombre: 'Nissan',         categoria: 'Automotriz',            agencia: 'DENTSU' },
  { nombre: 'LVMH',           categoria: 'Lujo',                  agencia: 'HAVAS' },
  { nombre: 'Sephora',        categoria: 'Belleza',               agencia: 'GROUPM' },
  { nombre: 'Little Caesars', categoria: 'QSR',                   agencia: 'OMG' },
  { nombre: 'AT&T México',    categoria: 'Telecomunicaciones',    agencia: 'IPG' },
];

/* ─────────────────────────── Plazas ─────────────────────────── */

export interface Plaza {
  id: string;          // mismo id que en mexicoPaths.ts
  nombre: string;
  inversionMXN: number;
  grps: number;
  alcancePct: number;
}

// Peso de cada plaza en la inversión publicitaria nacional (%). Suma ~100.
const PESO: { id: string; nombre: string; peso: number }[] = [
  { id: 'MX_DF', nombre: 'Ciudad de México',      peso: 21.5 },
  { id: 'MX_EM', nombre: 'Estado de México',      peso: 11.0 },
  { id: 'MX_JA', nombre: 'Jalisco',               peso: 8.2 },
  { id: 'MX_NL', nombre: 'Nuevo León',            peso: 7.6 },
  { id: 'MX_PU', nombre: 'Puebla',                peso: 4.5 },
  { id: 'MX_GT', nombre: 'Guanajuato',            peso: 4.2 },
  { id: 'MX_VE', nombre: 'Veracruz',              peso: 4.0 },
  { id: 'MX_CH', nombre: 'Chihuahua',             peso: 3.1 },
  { id: 'MX_BC', nombre: 'Baja California',       peso: 3.0 },
  { id: 'MX_MI', nombre: 'Michoacán',             peso: 2.8 },
  { id: 'MX_CO', nombre: 'Coahuila',              peso: 2.5 },
  { id: 'MX_SI', nombre: 'Sinaloa',               peso: 2.3 },
  { id: 'MX_SO', nombre: 'Sonora',                peso: 2.2 },
  { id: 'MX_TM', nombre: 'Tamaulipas',            peso: 2.2 },
  { id: 'MX_QT', nombre: 'Querétaro',             peso: 2.1 },
  { id: 'MX_SL', nombre: 'San Luis Potosí',       peso: 1.8 },
  { id: 'MX_HG', nombre: 'Hidalgo',               peso: 1.7 },
  { id: 'MX_GR', nombre: 'Guerrero',              peso: 1.5 },
  { id: 'MX_CS', nombre: 'Chiapas',               peso: 1.5 },
  { id: 'MX_OA', nombre: 'Oaxaca',                peso: 1.4 },
  { id: 'MX_YU', nombre: 'Yucatán',               peso: 1.4 },
  { id: 'MX_QR', nombre: 'Quintana Roo',          peso: 1.3 },
  { id: 'MX_MO', nombre: 'Morelos',               peso: 1.2 },
  { id: 'MX_DG', nombre: 'Durango',               peso: 1.0 },
  { id: 'MX_AG', nombre: 'Aguascalientes',        peso: 1.0 },
  { id: 'MX_ZA', nombre: 'Zacatecas',             peso: 0.9 },
  { id: 'MX_TB', nombre: 'Tabasco',               peso: 0.9 },
  { id: 'MX_TL', nombre: 'Tlaxcala',              peso: 0.7 },
  { id: 'MX_NA', nombre: 'Nayarit',               peso: 0.7 },
  { id: 'MX_CM', nombre: 'Campeche',              peso: 0.6 },
  { id: 'MX_CL', nombre: 'Colima',                peso: 0.5 },
  { id: 'MX_BS', nombre: 'Baja California Sur',   peso: 0.5 },
];

// Inversión total de industria monitoreada en el último periodo (dato simulado).
const INVERSION_INDUSTRIA = 21_400_000_000;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function construirPlazas(factorInversion: number): Plaza[] {
  return PESO.map(p => {
    const inversionMXN = Math.round(INVERSION_INDUSTRIA * factorInversion * p.peso / 100);
    const grps = Math.round(inversionMXN / 95_000);
    const alcancePct = Math.min(92, Math.round(52 + p.peso * 1.6 + (hash(p.id) % 9)));
    return { id: p.id, nombre: p.nombre, inversionMXN, grps, alcancePct };
  });
}

/* ─────────────────── Periodos y agregados de industria ─────────────────── */

export const PERIODOS = ['2023', '2024', '2025'];
export const ULTIMO = PERIODOS[PERIODOS.length - 1];

const FACTOR: Record<string, number> = { '2023': 0.82, '2024': 0.91, '2025': 1.00 };

export type TopPlaza = { plaza: string; inversionMXN: number };
export type TopAnunciante = { nombre: string; categoria: string; inversionMXN: number };

export type MedioVenta = 'TV abierta' | 'Radio' | 'OOH' | 'Digital' | 'CTV';

export type PeriodoData = {
  totalPlazas: number;
  inversionTotal: number;
  grpsTotal: number;
  alcanceProm: number;
  emisoras: number;
  impactos: number;
  inversionPorMedio: Record<MedioVenta, number>;
  inversionPorAsociado: Record<string, number>;   // spend atribuible al inventario de cada televisora
  topAnunciantes: TopAnunciante[];
  plazas: Plaza[];
  topPlazas: TopPlaza[];
};

function agregar(plazas: Plaza[], periodo: string): PeriodoData {
  const inversionTotal = plazas.reduce((s, p) => s + p.inversionMXN, 0);
  const grpsTotal = plazas.reduce((s, p) => s + p.grps, 0);
  const h = hash(periodo);

  const mediosPct: Record<MedioVenta, number> = {
    'TV abierta': 0.42 + ((h % 5) - 2) / 100,
    'Radio': 0.14,
    'OOH': 0.12,
    'Digital': 0.24,
    'CTV': 0.05 + (Number(periodo) - 2023) * 0.02,
  };
  const inversionPorMedio = Object.fromEntries(
    (Object.entries(mediosPct) as [MedioVenta, number][]).map(([m, pct]) => [m, Math.round(inversionTotal * pct)]),
  ) as Record<MedioVenta, number>;

  // Reparte el inventario de TV abierta entre las 3 televisoras por un peso
  // pseudoaleatorio determinista, normalizado para sumar exacto el total.
  const inversionTV = inversionPorMedio['TV abierta'];
  const pesos = TELEVISORAS.map(tv => 0.8 + (hash(tv.id + periodo) % 40) / 100);
  const sumaPesos = pesos.reduce((s, v) => s + v, 0);
  const inversionPorAsociado = Object.fromEntries(
    TELEVISORAS.map((tv, i) => [tv.id, Math.round(inversionTV * pesos[i] / sumaPesos)]),
  );

  const ordenadas = [...plazas].sort((a, b) => b.inversionMXN - a.inversionMXN);
  const topPlazas: TopPlaza[] = ordenadas.slice(0, 8).map(p => ({ plaza: p.nombre, inversionMXN: p.inversionMXN }));

  const topAnunciantes: TopAnunciante[] = [...ANUNCIANTES]
    .map(a => ({ nombre: a.nombre, categoria: a.categoria, inversionMXN: Math.round(inversionTotal * (0.02 + (hash(a.nombre + periodo) % 6) / 100)) }))
    .sort((a, b) => b.inversionMXN - a.inversionMXN)
    .slice(0, 8);

  return {
    totalPlazas: plazas.length,
    inversionTotal,
    grpsTotal,
    alcanceProm: Math.round(plazas.reduce((s, p) => s + p.alcancePct, 0) / plazas.length),
    emisoras: 214,
    impactos: grpsTotal * 41_000,
    inversionPorMedio,
    inversionPorAsociado,
    topAnunciantes,
    plazas,
    topPlazas,
  };
}

export const porPeriodo: Record<string, PeriodoData> = Object.fromEntries(
  PERIODOS.map(p => [p, agregar(construirPlazas(FACTOR[p]), p)]),
);

export const PLAZAS = porPeriodo[ULTIMO].plazas;

/** Cobertura operativa del monitoreo. */
export const COBERTURA = {
  plazas: 32,
  emisoras: 214,
};

/* ─────────────── Serie mensual de inversión por medio (Tablero) ───────────────
 * Contrato: granularidad mensual, últimos 12 meses. Fuente futura: HR Media →
 * Modelo de Mix de Medios, consolidado mes a mes. Aquí se deriva del mismo
 * inversionPorMedio de ULTIMO con una variación mensual determinista. */
export interface MesInversion {
  mes: string;
  'TV abierta': number;
  'Radio': number;
  'OOH': number;
  'Digital': number;
  'CTV': number;
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const SERIE_INVERSION_MENSUAL: MesInversion[] = MESES.map((mes, i) => {
  const base = porPeriodo[ULTIMO].inversionPorMedio;
  const factor = 0.94 + (hash(mes) % 12) / 100; // variación mensual ±~6%
  return {
    mes,
    'TV abierta': Math.round(base['TV abierta'] / 12 * factor),
    'Radio': Math.round(base['Radio'] / 12 * factor),
    'OOH': Math.round(base['OOH'] / 12 * factor),
    'Digital': Math.round(base['Digital'] / 12 * factor),
    'CTV': Math.round(base['CTV'] / 12 * (factor + i * 0.01)), // CTV con leve tendencia al alza
  };
});

/* ─────────────────────────── Helpers ─────────────────────────── */

export const fmt = (n: number) => n.toLocaleString('es-MX');
export const fmtMXN = (n: number) => '$' + n.toLocaleString('es-MX');
/** $1,840 M / $12.4 M — para KPIs donde el número completo no cabe. */
export const fmtMXNCorto = (n: number) =>
  n >= 1_000_000_000 ? `$${(n / 1_000_000_000).toFixed(2)} MMDP`
  : n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)} M`
  : fmtMXN(n);
