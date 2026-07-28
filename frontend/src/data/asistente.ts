// Cerebro / asistente front-only (sin backend, sin Gemini).
// Navega a secciones y responde preguntas con los datos que ya tenemos en mano.
import { porPeriodo, ULTIMO, CLIENTE, fmt, fmtMXNCorto, proyeccionSOV } from './media';
import { secciones } from '../config/menu';

const D = porPeriodo[ULTIMO];

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
  journey:    ['journey', 'customer journey', 'recorrido', 'embudo', 'funnel'],
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
  if (/(competencia|segunda marca|rival|competidor)/.test(t)) {
    return { text: `La segunda marca es ${D.segundaMarca} con ${D.lideradasSegunda} plazas lideradas, ${D.plazasLideradas - D.lideradasSegunda} por debajo de ${CLIENTE.nombre}.` };
  }
  if (/(prediccion|proyeccion|proximo periodo|futuro|forecast)/.test(t)) {
    return { text: `Proyección: si la tendencia se mantiene, ${CLIENTE.nombre} llegaría a ~${proyeccionSOV()}% de SOV el próximo periodo (venía de ${porPeriodo['2023'].sovCliente}% en 2023 a ${D.sovCliente}% en ${ULTIMO}).` };
  }

  return {
    text: 'Puedo dirigirte a una sección ("ve a Alertas") o responderte: cómo vamos en plazas, cuánto invertimos, qué dicen de la marca, cómo va el alcance, o la última mención al aire.',
  };
}
