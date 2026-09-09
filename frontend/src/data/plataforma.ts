// Catálogo de los módulos del Motor de Ingesta y Normalización. Vive aquí, y
// no dentro del componente, para que la tarjeta y el modal de detalle hablen
// de los mismos módulos con las mismas cifras.
//
// Es un pipeline, no una caja negra de "agentes autónomos": cada etapa recibe
// dato, lo valida u homologa, y lo entrega a la siguiente con su linaje.
// Ingesta recibe y ordena · Validación cruza contra la fuente · Modelo predice
// o califica · Distribución publica hallazgos e insumos para Conciliación.

import {
  todosSoportes, soportesCircuito, calcularOOHScore, MAX_IMPACTOS, MXM_TOTAL, TOTAL_INVENTARIO,
} from './ooh';

export type TipoModulo = 'Ingesta' | 'Validación' | 'Modelo' | 'Distribución';

export type EstadoModulo = 'activo' | 'demo' | 'en-activacion';

export interface SerieGrafica {
  key: string;
  label: string;
  color?: string;
}

export interface GraficaModulo {
  /** barrasH: categórica horizontal · barras: series comparadas · donut · spark */
  tipo: 'barrasH' | 'barras' | 'donut' | 'spark';
  titulo: string;
  ejeX: string;
  series: SerieGrafica[];
  data: Record<string, string | number>[];
}

export interface ModuloCerebro {
  num: number;
  id: string;
  tag: TipoModulo;
  titulo: string;
  descripcion: string;
  estado: EstadoModulo;
  /** Único módulo enchufado al servicio de monitoreo real. */
  enVivo?: boolean;
  metricas: { label: string; valor: string; delta?: string }[];
  grafica: GraficaModulo;
}

// Cifras reales del OOH Opportunity Score: se calculan sobre el inventario que
// ya está cargado, no se escriben a mano. Si el datalab reprocesa los Excel, el
// módulo cambia solo — y nunca muestra un número que la fórmula no produce.
const SCORES = todosSoportes.map(s => calcularOOHScore(s, MAX_IMPACTOS));
const scorePromedio = Math.round(SCORES.reduce((a, b) => a + b, 0) / SCORES.length);
const scoreMaximo = Math.max(...SCORES);
const scoreSobre70 = SCORES.filter(x => x >= 70).length;
const enRango = (min: number, max: number) => SCORES.filter(x => x >= min && x < max).length;
/** Soportes con audiencia medida Y tarifa: los únicos que podrían llegar a score alto. */
const conAmbasFuentes = todosSoportes.filter(s => s.audiencia && s.tarifa_publicada_mxn).length;

const AZUL = '#1E3A8A';
const VERDE = '#22c55e';
const AMBAR = '#f59e0b';
const ROJO = '#ef4444';
const GRIS = '#94a3b8';

export const MODULOS_CEREBRO: ModuloCerebro[] = [
  {
    num: 1, id: 'intake', tag: 'Ingesta', titulo: 'Recepción de Entregas', estado: 'en-activacion',
    descripcion: 'Recibe el archivo o feed de cada proveedor, detecta campos faltantes o fuera de formato y abre el expediente de linaje: quién lo entregó, cuándo y bajo qué versión de metodología.',
    metricas: [
      { label: 'Entregas procesadas', valor: '147', delta: '+12 este mes' },
      { label: 'Campos detectados faltantes', valor: '89%', delta: 'precisión' },
      { label: 'Tiempo entrega→expediente', valor: '4 min', delta: 'vs 2.5 hrs manual' },
      { label: 'First-time-right rate', valor: '73%', delta: '+8pp vs baseline' },
    ],
    grafica: {
      tipo: 'barras', titulo: 'Entregas recibidas vs. completas', ejeX: 'semana',
      series: [{ key: 'briefs', label: 'Recibidas', color: GRIS }, { key: 'completos', label: 'Completas', color: AZUL }],
      data: [
        { semana: 'S1', briefs: 28, completos: 19 },
        { semana: 'S2', briefs: 35, completos: 27 },
        { semana: 'S3', briefs: 41, completos: 32 },
        { semana: 'S4', briefs: 43, completos: 34 },
      ],
    },
  },
  {
    num: 2, id: 'traffic', tag: 'Ingesta', titulo: 'Control de Capacidad', estado: 'en-activacion',
    descripcion: 'Distribuye la carga de procesamiento entre fuentes (TV, Radio, OOH, Digital, CTV) según su volumen real y detecta saturación de un hub antes de que retrase la publicación.',
    metricas: [
      { label: 'Cargas en flujo activo', valor: '23', delta: '5 en riesgo' },
      { label: 'Utilización promedio hubs', valor: '78%', delta: 'Hub OOH: 94%' },
      { label: 'SLA en riesgo detectados', valor: '5', delta: 'vs 12 anterior' },
      { label: 'Reprocesos sugeridos', valor: '8', delta: 'esta semana' },
    ],
    grafica: {
      tipo: 'barrasH', titulo: 'Carga por hub (%)', ejeX: 'hub',
      series: [{ key: 'carga', label: 'Carga' }],
      data: [
        { hub: 'TV', carga: 65 }, { hub: 'Radio', carga: 72 }, { hub: 'OOH', carga: 94 },
        { hub: 'Digital', carga: 81 }, { hub: 'CTV', carga: 58 },
      ],
    },
  },
  {
    num: 3, id: 'sla', tag: 'Ingesta', titulo: 'Monitor de SLA', estado: 'en-activacion',
    descripcion: 'Semáforo de cumplimiento por proveedor: tiempo restante para la próxima entrega y dependencias bloqueadas, para anticipar un incumplimiento antes de que rompa el reporte de industria.',
    metricas: [
      { label: 'SLAs activos monitoreados', valor: '67' },
      { label: 'En verde (a tiempo)', valor: '51', delta: '76%' },
      { label: 'En ámbar (riesgo)', valor: '11', delta: '16%' },
      { label: 'En rojo (vencido / crítico)', valor: '5', delta: '7%' },
    ],
    grafica: {
      tipo: 'donut', titulo: 'Semáforo de SLAs', ejeX: 'estado',
      series: [{ key: 'valor', label: 'SLAs' }],
      data: [
        { estado: 'Verde', valor: 51, fill: VERDE },
        { estado: 'Ámbar', valor: 11, fill: AMBAR },
        { estado: 'Rojo', valor: 5, fill: ROJO },
      ],
    },
  },
  {
    num: 4, id: 'budget', tag: 'Ingesta', titulo: 'Control de Cambios', estado: 'en-activacion',
    descripcion: 'Detecta cambios de metodología, tarifa o alcance entre entregas del mismo proveedor y alerta antes de que un cambio no versionado rompa la comparabilidad histórica.',
    metricas: [
      { label: 'Volumen total monitoreado', valor: '$21.4 MMDP', delta: 'este periodo' },
      { label: 'Cambios de metodología detectados', valor: '3', delta: 'sin versionar' },
      { label: 'Alertas de tarifa activas', valor: '7' },
      { label: 'Inconsistencias resueltas', valor: '18', delta: 'este mes' },
    ],
    grafica: {
      tipo: 'barras', titulo: 'Reportado vs. validado (MMDP)', ejeX: 'mes',
      series: [{ key: 'planeado', label: 'Reportado', color: GRIS }, { key: 'ejecutado', label: 'Validado', color: AZUL }],
      data: [
        { mes: 'May', planeado: 38, ejecutado: 36.2 },
        { mes: 'Jun', planeado: 42, ejecutado: 43.1 },
        { mes: 'Jul', planeado: 47, ejecutado: 47.3 },
      ],
    },
  },
  {
    num: 5, id: 'testigos', tag: 'Validación', titulo: 'Verificación On-Air', estado: 'activo', enVivo: true,
    descripcion: 'Escucha emisoras en vivo, transcribe menciones y cruza lo detectado contra lo contratado. Es el módulo que produce evidencia auditable, no una cifra de industria agregada.',
    metricas: [
      { label: 'Emisoras monitoreadas', valor: '5', delta: 'en vivo' },
      { label: 'Detecciones hoy', valor: '34' },
      { label: 'Discrepancias abiertas en Conciliación', valor: '2', delta: 'alta prioridad' },
      { label: 'Uptime del servicio', valor: '99.2%', delta: '30 días' },
    ],
    grafica: {
      tipo: 'spark', titulo: 'Detecciones por hora', ejeX: 'hora',
      series: [{ key: 'menciones', label: 'Detecciones' }],
      data: [
        { hora: '08h', menciones: 3 }, { hora: '10h', menciones: 7 }, { hora: '12h', menciones: 11 },
        { hora: '14h', menciones: 8 }, { hora: '16h', menciones: 5 },
      ],
    },
  },
  {
    num: 6, id: 'pauta', tag: 'Validación', titulo: 'Cruce de Entregas', estado: 'en-activacion',
    descripcion: 'Compara lo reportado por el medio contra lo reportado por la agencia línea por línea, y marca cada línea sin coincidencia como caso para Conciliación.',
    metricas: [
      { label: 'Líneas cruzadas', valor: '312' },
      { label: 'Coincidencia medio vs. agencia', valor: '94.3%' },
      { label: 'Líneas en disputa', valor: '18', delta: 'enviadas a Conciliación' },
      { label: 'Resueltas este mes', valor: '15' },
    ],
    grafica: {
      tipo: 'barrasH', titulo: 'Coincidencia por medio (%)', ejeX: 'medio',
      series: [{ key: 'entregado', label: 'Coincidencia' }],
      data: [
        { medio: 'TV', entregado: 97 }, { medio: 'Radio', entregado: 99 },
        { medio: 'OOH', entregado: 91 }, { medio: 'Digital', entregado: 96 },
      ],
    },
  },
  {
    num: 7, id: 'mmm', tag: 'Modelo', titulo: 'Modelo de Mix de Medios', estado: 'en-activacion',
    descripcion: 'Distribuye la inversión de industria por canal a partir del dato ya validado. No atribuye a un anunciante en particular: describe cómo se reparte el mercado entre medios.',
    metricas: [
      { label: 'Inversión modelada', valor: '$14.2 MMDP', delta: 'últimos 6 meses' },
      { label: 'R² del modelo', valor: '0.87', delta: 'buena precisión' },
      { label: 'Mayor participación', valor: 'TV abierta', delta: '42% del total' },
      { label: 'Canal de mayor crecimiento', valor: 'CTV', delta: '+2pp por periodo' },
    ],
    grafica: {
      tipo: 'donut', titulo: 'Participación por canal (%)', ejeX: 'canal',
      series: [{ key: 'contribucion', label: 'Participación' }],
      data: [
        { canal: 'TV', contribucion: 42 }, { canal: 'Digital', contribucion: 24 },
        { canal: 'OOH', contribucion: 12 }, { canal: 'Radio', contribucion: 14 },
        { canal: 'CTV', contribucion: 8 },
      ],
    },
  },
  {
    num: 8, id: 'ooh_score', tag: 'Modelo', titulo: 'Modelo de Oportunidad OOH', estado: 'demo',
    descripcion: 'Califica soportes OOH por audiencia × alcance incremental × proximidad ÷ costo ajustado, sobre el Censo OOH. El score mejora cuando se cruzan audiencia + tarifa por soporte: hoy el circuito medido trae audiencia sin tarifa y el inventario trae tarifa sin audiencia, así que ningún soporte puntúa completo.',
    metricas: [
      { label: 'Soportes evaluados', valor: String(TOTAL_INVENTARIO), delta: `${soportesCircuito.length} medidos + ${MXM_TOTAL} inventario` },
      { label: 'Score promedio', valor: `${scorePromedio}/100`, delta: `techo actual ${scoreMaximo}/100 por datos incompletos` },
      { label: 'Soportes score >70', valor: String(scoreSobre70), delta: `${conAmbasFuentes} soportes con audiencia y tarifa` },
      { label: 'Soportes pendientes de doble fuente', valor: String(TOTAL_INVENTARIO - conAmbasFuentes), delta: 'audiencia o tarifa faltante' },
    ],
    grafica: {
      tipo: 'barrasH', titulo: 'Distribución de scores', ejeX: 'rango',
      series: [{ key: 'count', label: 'Soportes' }],
      data: [
        { rango: '0-40', count: enRango(0, 40) }, { rango: '40-60', count: enRango(40, 60) },
        { rango: '60-80', count: enRango(60, 80) }, { rango: '80-100', count: enRango(80, 101) },
      ],
    },
  },
  {
    num: 9, id: 'competencia', tag: 'Distribución', titulo: 'Consistencia entre Proveedores', estado: 'en-activacion',
    descripcion: 'Compara las cifras de HR Media contra el proveedor que resulte de la licitación en curso, sobre el mismo universo y periodo, para detectar desviaciones metodológicas entre ambos.',
    metricas: [
      { label: 'Proveedores comparados', valor: '2', delta: 'HR Media + licitación' },
      { label: 'Desviación promedio', valor: '2.1%', delta: 'entre proveedores' },
      { label: 'Alertas de desviación', valor: '3', delta: 'esta semana' },
      { label: 'Métricas en comparación', valor: '12' },
    ],
    grafica: {
      tipo: 'barras', titulo: 'Desviación semanal entre proveedores (%)', ejeX: 'semana',
      series: [
        { key: 'cliente', label: 'HR Media', color: AZUL },
        { key: 'comp1', label: 'Licitación (piloto)', color: GRIS },
      ],
      data: [
        { semana: 'S1', cliente: 22, comp1: 21 },
        { semana: 'S2', cliente: 23, comp1: 24 },
        { semana: 'S3', cliente: 24, comp1: 23 },
        { semana: 'S4', cliente: 24.3, comp1: 25 },
      ],
    },
  },
  {
    num: 10, id: 'anomalias', tag: 'Distribución', titulo: 'Detección de Anomalías', estado: 'en-activacion',
    descripcion: 'Detecta discrepancias de pauta, tráfico inválido y gasto sin sustento en el dato ya validado, y alimenta con eso los casos que llegan a Conciliación.',
    metricas: [
      { label: 'Anomalías detectadas este mes', valor: '23' },
      { label: 'Tráfico inválido identificado', valor: '3.2%', delta: 'de impresiones' },
      { label: 'Casos enviados a Conciliación', valor: '9', delta: 'este mes' },
      { label: 'Discrepancias OOH', valor: '2', delta: 'alta prioridad' },
    ],
    grafica: {
      tipo: 'barrasH', titulo: 'Anomalías por tipo', ejeX: 'tipo',
      series: [{ key: 'count', label: 'Casos' }],
      data: [
        { tipo: 'Tráfico inválido', count: 11 }, { tipo: 'Discrepancia pauta', count: 7 },
        { tipo: 'Viewability baja', count: 3 }, { tipo: 'Colocación incorrecta', count: 2 },
      ],
    },
  },
];

export const modulosPorTipo = (tipo: TipoModulo) => MODULOS_CEREBRO.filter(m => m.tag === tipo);

/** Color del badge de categoría. */
export const COLOR_CATEGORIA: Record<TipoModulo, string> = {
  'Ingesta': '#1E3A8A',       // azul institucional
  'Validación': '#F97316',    // naranja
  'Modelo': '#15803D',        // verde oscuro
  'Distribución': '#0F1E4D',  // azul casi negro
};

/** Punto + etiqueta del estado del módulo. */
export const ESTADO_MODULO: Record<EstadoModulo, { texto: string; color: string }> = {
  'activo': { texto: 'En vivo', color: '#22c55e' },
  'demo': { texto: 'Demo', color: '#f59e0b' },
  'en-activacion': { texto: 'Próximamente', color: '#94a3b8' },
};

/** Composición del pipeline, para textos que lo enumeran. */
export const composicion = (): string =>
  (['Ingesta', 'Validación', 'Modelo', 'Distribución'] as TipoModulo[])
    .map(t => `${modulosPorTipo(t).length} de ${t}`)
    .join(' · ');
