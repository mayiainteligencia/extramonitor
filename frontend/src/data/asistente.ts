// Cerebro / asistente front-only (sin backend, sin Gemini).
// Conoce el mapa completo de la plataforma: secciones (config/menu.ts), módulos
// del Cerebro Orquestador (data/plataforma.ts) y las cifras de data/media.ts.
import {
  porPeriodo, ULTIMO, CLIENTE, CARTERA, COBERTURA, ALERTAS, MARCAS,
  fmt, fmtMXNCorto, proyeccionSOV,
} from './media';
import { secciones, tituloEstado } from '../config/menu';
import { brandingConfig } from '../config/branding';
import { MODULOS_CEREBRO, modulosPorTipo, composicion } from './plataforma';

const D = porPeriodo[ULTIMO];
const { ia } = brandingConfig;

export type Seccion = { id: string; titulo: string; alias: string[] };

// Alias de voz/búsqueda por sección. Los títulos salen de config/menu.ts.
const ALIAS: Record<string, string[]> = {
  warroom:    ['inicio', 'principal', 'home', 'general', 'panel', 'war room'],
  testigos:   ['testigos', 'radio', 'medios', 'on air', 'spots'],
  cerebro:    ['cerebro', 'orquestador', 'operadores', 'modelos', 'mayia'],
  comando:    ['comando', 'campana', 'mando', 'central'],
  investment: ['investment', 'inversion', 'valor', 'roi', 'presupuesto'],
  alertas:    ['alertas', 'marca', 'focos', 'riesgos', 'atencion'],
  digital:    ['digital', 'ecommerce', 'e-commerce', 'web', 'redes'],
  ooh:        ['ooh', 'exterior', 'espectaculares', 'carteleras', 'vallas', 'planner'],
  adfraud:    ['fraude', 'ad fraud', 'brand safety', 'seguridad'],
  studio:     ['studio', 'creativo', 'piezas', 'creatividades'],
  academia:   ['academia', 'cursos', 'capacitacion'],
};

export const SECCIONES: Seccion[] = secciones.map(s => ({
  id: s.id,
  titulo: s.nombre,
  alias: ALIAS[s.id] ?? [],
}));

export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Búsqueda del header: coincidencias por título o alias.
export function buscarSeccion(q: string): Seccion[] {
  const t = norm(q).trim();
  if (!t) return [];
  return SECCIONES.filter(s =>
    norm(s.titulo).includes(t) || s.alias.some(a => norm(a).includes(t) || t.includes(norm(a)))
  );
}

const VERBOS_NAV = ['ve al', 've a', 'ir al', 'ir a', 'entra', 'llevame', 'vamos a', 'muestrame', 'muestra', 'abre', 'abrir', 'ir '];

export type Respuesta = { text: string; navigateTo?: string };

export function responder(texto: string): Respuesta {
  const t = norm(texto);

  // ── Navegación por voz ──
  if (VERBOS_NAV.some(v => t.includes(v))) {
    for (const s of SECCIONES) {
      if (norm(s.titulo).split(/\s+/).some(w => w.length > 3 && t.includes(w)) || s.alias.some(a => t.includes(norm(a)))) {
        return { text: `Te llevo a ${s.titulo}.`, navigateTo: s.id };
      }
    }
  }

  // ── Qué es la plataforma / qué puede hacer ──
  if (/(que puedes hacer|que sabes|para que sirves|ayuda|que es esta plataforma|quien eres)/.test(t)) {
    return { text: `Soy ${ia.nombre}, el asistente de la plataforma. Conozco las ${SECCIONES.length} secciones, los ${MODULOS_CEREBRO.length} módulos del Cerebro Orquestador y las cifras de la cuenta ${CLIENTE.nombre}. Puedes pedirme que te lleve a una sección ("ve a Alertas"), preguntarme qué hace cualquiera de ellas, o consultarme plazas, inversión, alcance, competencia y alertas.` };
  }

  // ── Mapa de secciones ──
  if (/(que secciones|cuantas secciones|que hay en la plataforma|menu|navegacion|que modulos hay|secciones)/.test(t) && !seccionMencionada(t)) {
    const lista = secciones.map(s => `· ${s.nombre} — ${tituloEstado[s.estado].toLowerCase()}`).join('\n');
    return { text: `La plataforma tiene ${secciones.length} secciones:\n${lista}\nPregúntame por cualquiera para el detalle, o dime "ve a…" para abrirla.` };
  }

  // ── Qué hace una sección concreta ──
  const sec = seccionMencionada(t);
  if (sec && /(que es|que hace|para que|que veo|que hay en|explicame|de que trata|como funciona|que tiene)/.test(t)) {
    const meta = secciones.find(x => x.id === sec.id)!;
    return { text: `${meta.nombre}: ${meta.descripcion} (${tituloEstado[meta.estado].toLowerCase()}). Dime "ve a ${meta.nombre}" y te llevo.` };
  }

  // ── Módulos del Cerebro Orquestador ──
  if (/(operadores)/.test(t)) return { text: listaModulos('Operador') };
  if (/(modelos predictivos|los modelos|modelo de)/.test(t)) return { text: listaModulos('Modelo') };
  if (/(agentes de insights|insights)/.test(t)) return { text: listaModulos('Agente de Insights') };
  if (/(agentes|los agentes)/.test(t)) return { text: listaModulos('Agente') };
  if (/(modulos|orquestador|cerebro)/.test(t)) {
    return { text: `El Cerebro Orquestador coordina ${MODULOS_CEREBRO.length} módulos: ${composicion()}. Los Agentes operan el flujo de trabajo, los Operadores ejecutan sobre los medios, los Modelos predicen y los Agentes de Insights generan hallazgos. El único conectado a datos en vivo es el Operador de Testigos. Pregúntame por los Agentes, los Operadores, los Modelos o los Agentes de Insights para el desglose.` };
  }
  const modulo = MODULOS_CEREBRO.find(m => t.includes(norm(m.titulo)) || t.includes(norm(m.titulo.replace(/^(Operador|Modelo|Agente) (de |Predictivo de )?/, ''))));
  if (modulo) {
    return { text: `${modulo.titulo} (${modulo.tag}): ${modulo.descripcion}${modulo.enVivo ? ' Es el único módulo enchufado al monitoreo real.' : ''} Ábrelo desde el Cerebro Orquestador.` };
  }

  // ── Qué está vivo y qué es demo ──
  if (/(demo|en vivo|real|conectado|que funciona|estado de la plataforma|activo)/.test(t)) {
    const activas = secciones.filter(s => s.estado === 'activo').map(s => s.nombre);
    const demo = secciones.filter(s => s.estado === 'demo').length;
    const act = secciones.filter(s => s.estado === 'en-activacion').length;
    return { text: `Con datos reales solo ${activas.join(', ')}, que escucha ${fmt(COBERTURA.emisoras)} emisoras en vivo. Otras ${demo} secciones corren con datos estructurados de demo y ${act} están en activación. En el menú lateral cada sección lleva su punto de color: verde activo, ámbar demo, gris en activación.` };
  }

  // ── Cartera de clientes ──
  if (/(clientes|cartera|cuentas|marcas que|portafolio)/.test(t)) {
    const top = CARTERA.slice(0, 4).map(c => c.nombre).join(', ');
    return { text: `La cartera tiene ${CARTERA.length} cuentas: ${top} y ${CARTERA.length - 4} más. La que alimenta este tablero es ${CLIENTE.nombre} (${CARTERA[0].categoria}), con ${CARTERA[0].sharePresupuesto}% de la inversión gestionada. La ves completa en el War Room.` };
  }

  // ── Competencia y set competitivo ──
  if (/(competencia|segunda marca|rival|competidor|contra quien)/.test(t)) {
    const comp = MARCAS.filter(m => !m.esCliente).map(m => m.nombre).join(', ');
    return { text: `${CLIENTE.nombre} compite contra ${comp}. La segunda marca es ${D.segundaMarca} con ${D.lideradasSegunda} plazas lideradas, ${D.plazasLideradas - D.lideradasSegunda} por debajo. El Agente de Competencia sigue esos movimientos.` };
  }

  // ── Alertas ──
  if (/(alertas|que paso|novedades|urgente|pendientes)/.test(t)) {
    const altas = ALERTAS.filter(a => a.severidad === 'alta');
    return { text: `Hay ${ALERTAS.length} alertas abiertas, ${altas.length} de severidad alta. La más reciente: ${altas[0].descripcion} (${altas[0].plaza}, ${altas[0].medio}). Revísalas en Alertas de Marca.` };
  }

  // ── Preguntas sobre los datos ──
 if (/(redes|social|facebook|twitter|instagram|tiktok)/.test(t)) {
    return { text: `En redes la conversación crece: ${fmt(Math.round(D.impactos / 1_000_000))}M de impactos estimados esta semana, +18% vs la anterior. El sentimiento a favor ronda el 46%. Abre Monitor Digital & E-Commerce para el detalle.` };
  }
  if (/(a favor|nos ven|como nos ven|sentimiento|percepcion)/.test(t)) {
    return { text: `La audiencia ve a ${CLIENTE.nombre} mayormente a favor: 46% positivo, 34% neutral, 20% negativo. En las plazas líderes el positivo sube. Revisa Journey Intelligence para el desglose por etapa.` };
  }
  if (/(que dicen|dicen de|hablan de|menciones|narrativa)/.test(t)) {
    return { text: `Lo que más se dice de ${CLIENTE.nombre}: servicio y disponibilidad (positivo), dudas sobre precio (neutral). El último spot se cita textual en 3 estaciones. ${D.segundaMarca} es la principal competencia con ${D.lideradasSegunda} plazas lideradas.` };
  }
  if (/(ultima mencion|mencion.*radio|radio.*mencion|en radio|on air|al aire)/.test(t)) {
    return { text: `La última mención al aire fue hace 8 min en MVS Radio 102.5, sentimiento positivo. Abre Testigos IA para escuchar el testigo.` };
  }
  if (/(plazas|como vamos|share of voice|sov|cuantas plazas)/.test(t)) {
    return { text: `Vamos bien: ${CLIENTE.nombre} lidera ${fmt(D.plazasLideradas)} de ${fmt(D.totalPlazas)} plazas con ${D.sovCliente}% de Share of Voice ponderado (${fmt(D.grpsTotal)} GRPs). Hay ${D.discrepancias.length} plazas con discrepancias de pauta abiertas.` };
  }
  if (/(inversion|presupuesto|gasto|cuanto invertimos)/.test(t)) {
    return { text: `La inversión de ${CLIENTE.nombre} en el periodo es ${fmtMXNCorto(D.inversionCliente)} sobre ${fmtMXNCorto(D.inversionTotal)} de categoría. Investment Value IA tiene el desglose por plaza.` };
  }
  if (/(alcance|cobertura)/.test(t)) {
    return { text: `El alcance promedio es ${D.alcanceProm}%. Hay ${D.riesgoAlcance.length} plazas por debajo del objetivo de cobertura — foco de trabajo en Alertas de Marca.` };
  }
  if (/(prediccion|proyeccion|proximo periodo|futuro|forecast)/.test(t)) {
    return { text: `Proyección: si la tendencia se mantiene, ${CLIENTE.nombre} llegaría a ~${proyeccionSOV()}% de SOV el próximo periodo (venía de ${porPeriodo['2023'].sovCliente}% en 2023 a ${D.sovCliente}% en ${ULTIMO}).` };
  }

  return {
    text: `Puedo llevarte a cualquiera de las ${SECCIONES.length} secciones ("ve a Alertas"), explicarte qué hace cada una o qué son los Operadores, Modelos y Agentes de Insights del Cerebro Orquestador. También te respondo cómo vamos en plazas, cuánto invertimos, qué dicen de la marca, cómo va el alcance, quién es la competencia o qué alertas hay abiertas.`,
  };
}

// ── Utilidades de conocimiento ──

/** Devuelve la sección mencionada en el texto, si la hay. */
function seccionMencionada(t: string): Seccion | undefined {
  return SECCIONES.find(s =>
    norm(s.titulo).split(/\s+/).some(w => w.length > 3 && t.includes(w)) ||
    s.alias.some(a => t.includes(norm(a)))
  );
}

function listaModulos(tipo: Parameters<typeof modulosPorTipo>[0]): string {
  const ms = modulosPorTipo(tipo);
  const lista = ms.map(m => `· ${m.titulo} — ${m.descripcion}`).join('\n');
  return `${ms.length} ${tipo}${ms.length > 1 ? 's' : ''} en el Cerebro Orquestador:\n${lista}`;
}
