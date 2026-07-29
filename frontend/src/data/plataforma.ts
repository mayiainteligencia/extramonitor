// Catálogo de los módulos del Cerebro Orquestador. Vive aquí, y no dentro del
// componente, para que el asistente pueda hablar de ellos sin duplicar la lista.
//
// Jerarquía: Operadores ejecutan · Modelos predicen · Agentes de Insights
// generan hallazgos. "Agente" no se usa como término genérico.

export type TipoModulo = 'Operador' | 'Modelo' | 'Agente de Insights';

export interface ModuloCerebro {
  num: number;
  tag: TipoModulo;
  titulo: string;
  descripcion: string;
  /** Único módulo enchufado al servicio de monitoreo real. */
  enVivo?: boolean;
}

export const MODULOS_CEREBRO: ModuloCerebro[] = [
  { num: 1,  tag: 'Operador', titulo: 'Operador de Testigos', enVivo: true,
    descripcion: 'Escucha las emisoras en vivo y confirma que cada spot contratado salió al aire.' },
  { num: 2,  tag: 'Operador', titulo: 'Operador de Pauta',
    descripcion: 'Rebalancea la compra online y offline entre plazas según el costo por punto.' },
  { num: 3,  tag: 'Operador', titulo: 'Operador de Contenido',
    descripcion: 'Genera variantes creativas por formato y plaza a partir de la pieza maestra.' },
  { num: 4,  tag: 'Operador', titulo: 'Operador de E-Commerce',
    descripcion: 'Vigila catálogo, precio y disponibilidad en marketplaces y retail propio.' },
  { num: 5,  tag: 'Modelo', titulo: 'Modelo de Mix de Medios (MMM)',
    descripcion: 'Atribuye a cada canal su contribución a las ventas y guía el reparto de inversión.' },
  { num: 6,  tag: 'Modelo', titulo: 'Modelo Predictivo de Alcance',
    descripcion: 'Proyecta cobertura y frecuencia efectiva antes de comprometer la compra.' },
  { num: 7,  tag: 'Modelo', titulo: 'Modelo de Elasticidad de Precio',
    descripcion: 'Estima la sensibilidad al precio por plaza y el umbral de promoción rentable.' },
  { num: 8,  tag: 'Agente de Insights', titulo: 'Agente de Insights de Consumidor',
    descripcion: 'Convierte señales de audiencia en hallazgos accionables por segmento.' },
  { num: 9,  tag: 'Agente de Insights', titulo: 'Agente de Competencia',
    descripcion: 'Sigue el Share of Voice y los movimientos de pauta del mercado.' },
  { num: 10, tag: 'Agente de Insights', titulo: 'Agente de Anomalías',
    descripcion: 'Detecta fraude publicitario, discrepancias de pauta y gasto desperdiciado.' },
];

export const modulosPorTipo = (tipo: TipoModulo) => MODULOS_CEREBRO.filter(m => m.tag === tipo);
