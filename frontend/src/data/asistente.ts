// Cerebro / asistente front-only (sin backend, sin Gemini).
// Conoce el mapa de la plataforma: secciones (config/menu.ts), etapas del
// Motor de Ingesta (data/plataforma.ts) y las cifras de industria de
// data/media.ts. No habla de "cliente" ni de marca: ACAM es neutral.
import { porPeriodo, ULTIMO, ASOCIADOS, fmtMXNCorto } from './media';
import { secciones, tituloEstado } from '../config/menu';
import { brandingConfig } from '../config/branding';
import { MODULOS_CEREBRO, modulosPorTipo, composicion } from './plataforma';

const D = porPeriodo[ULTIMO];
const { ia } = brandingConfig;

export type Seccion = { id: string; titulo: string; alias: string[] };

// Alias de voz/búsqueda por sección. Los títulos salen de config/menu.ts.
const ALIAS: Record<string, string[]> = {
  verificacion: ['verificacion', 'testigos', 'radio', 'on air', 'spots', 'evidencia'],
  partners:     ['partners', 'proveedores', 'hr media', 'licitacion', 'hub'],
  catalogo:     ['catalogo', 'homologacion', 'anunciantes', 'marcas', 'diccionario'],
  conciliacion: ['conciliacion', 'disputa', 'casos', 'delta'],
  inversion:    ['inversion', 'valor', 'presupuesto', 'gasto', 'spend'],
  ingesta:      ['ingesta', 'normalizacion', 'pipeline', 'motor'],
  trazabilidad: ['trazabilidad', 'auditoria', 'linaje', 'metodologia'],
  ooh:          ['ooh', 'exterior', 'espectaculares', 'carteleras', 'vallas', 'censo'],
  digital:      ['digital', 'web', 'redes', 'geo', 'aeo'],
  ctv:          ['ctv', 'streaming', 'conectada'],
  influencers:  ['influencers', 'creadores'],
  academia:     ['academia', 'cursos', 'capacitacion'],
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
    return { text: `Soy ${ia.nombre}, el asistente de la plataforma de ACAM. Conozco las ${SECCIONES.length} secciones y las ${MODULOS_CEREBRO.length} etapas del Motor de Ingesta. Puedes pedirme que te lleve a una sección ("ve a Conciliación"), preguntarme qué hace cualquiera de ellas, o consultarme por la inversión de industria, los proveedores o los casos abiertos.` };
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

  // ── Etapas del Motor de Ingesta ──
  if (/(ingesta)/.test(t)) return { text: listaModulos('Ingesta') };
  if (/(validacion)/.test(t)) return { text: listaModulos('Validación') };
  if (/(modelos|los modelos|modelo de)/.test(t)) return { text: listaModulos('Modelo') };
  if (/(distribucion)/.test(t)) return { text: listaModulos('Distribución') };
  if (/(pipeline|motor de ingesta|etapas)/.test(t)) {
    return { text: `El Motor de Ingesta y Normalización tiene ${MODULOS_CEREBRO.length} etapas: ${composicion()}. Ingesta recibe y ordena, Validación cruza contra la fuente, los Modelos predicen o califican, y Distribución publica hallazgos para Conciliación. La única enchufada a datos en vivo es Verificación On-Air.` };
  }
  const modulo = MODULOS_CEREBRO.find(m => t.includes(norm(m.titulo)));
  if (modulo) {
    return { text: `${modulo.titulo} (${modulo.tag}): ${modulo.descripcion}${modulo.enVivo ? ' Es la única etapa conectada al monitoreo real.' : ''} Ábrelo desde el Motor de Ingesta y Normalización.` };
  }

  // ── Qué está vivo y qué es demo ──
  if (/(demo|en vivo|real|conectado|que funciona|estado de la plataforma|activo)/.test(t)) {
    const activas = secciones.filter(s => s.estado === 'activo').map(s => s.nombre);
    const demo = secciones.filter(s => s.estado === 'demo').length;
    const act = secciones.filter(s => s.estado === 'en-activacion').length;
    return { text: `Con datos reales solo ${activas.join(', ')}, que escucha ${D.emisoras} emisoras en vivo. Otras ${demo} secciones corren con datos estructurados de demo (marcados como tal) y ${act} están en activación. En el menú lateral cada sección lleva su punto de color: verde activo, ámbar demo, gris en activación.` };
  }

  // ── Asociados de ACAM ──
  if (/(asociados|quienes forman|integrantes|televisoras|agencias|quien es acam|jic)/.test(t)) {
    const tv = ASOCIADOS.filter(a => a.tipo === 'television').map(a => a.nombre).join(', ');
    const ag = ASOCIADOS.filter(a => a.tipo === 'agencia').map(a => a.nombre).join(', ');
    return { text: `ACAM tiene 9 asociados en dos bloques: 3 televisoras que venden espacio (${tv}) y 6 agencias que compran (${ag}). Las decisiones técnicas las toma un comité con representantes de cada uno.` };
  }

  // ── Inversión de industria ──
  if (/(inversion|presupuesto|gasto|cuanto se invirtio|spend)/.test(t)) {
    return { text: `La inversión de industria monitoreada en ${ULTIMO} es de ${fmtMXNCorto(D.inversionTotal)} (dato simulado). El desglose por medio, categoría y anunciante está en Inversión Publicitaria.` };
  }

  // ── Casos y conciliación ──
  if (/(casos|conciliacion|disputa|discrepancia)/.test(t)) {
    return { text: `Los casos abiertos entre lo reportado por el medio y lo reportado por la agencia viven en Conciliación, con la evidencia de Verificación On-Air como respaldo. Ábrela para ver el delta y el estado de cada caso.` };
  }

  // ── Alcance / cobertura ──
  if (/(alcance|cobertura)/.test(t)) {
    return { text: `El alcance promedio de industria es ${D.alcanceProm}%, sobre ${D.totalPlazas} plazas monitoreadas. Detalle en Inversión Publicitaria.` };
  }

  return {
    text: `Puedo llevarte a cualquiera de las ${SECCIONES.length} secciones ("ve a Conciliación"), explicarte qué hace cada una o qué son las etapas del Motor de Ingesta. También te respondo sobre los asociados de ACAM, la inversión de industria, o los casos abiertos en Conciliación.`,
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
  return `${ms.length} etapa${ms.length > 1 ? 's' : ''} de ${tipo} en el Motor de Ingesta:\n${lista}`;
}
