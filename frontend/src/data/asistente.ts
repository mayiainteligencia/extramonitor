// Asistente front-only (sin backend). Conoce el mapa de secciones (config/menu.ts)
// y las cifras de operación del día (data/operaciones.ts, data/incidencias.ts, data/analitica.ts).
import { secciones, tituloEstado } from '../config/menu';
import { brandingConfig } from '../config/branding';
import { KPIS_HOY, SERVICIOS_POR_ESTATUS } from './operaciones';
import { INCIDENCIAS } from './incidencias';
import { SLA_POR_CLIENTE } from './analitica';

const { ia } = brandingConfig;

export type Seccion = { id: string; titulo: string; alias: string[] };

// Alias de voz/búsqueda por sección. Los títulos salen de config/menu.ts.
const ALIAS: Record<string, string[]> = {
  dashboard:   ['inicio', 'principal', 'home', 'general', 'panel'],
  clientes:    ['clientes', 'cartera', 'cuentas', 'prospectos'],
  servicios:   ['servicios', 'programacion', 'agenda', 'calendario'],
  rutas:       ['rutas', 'flota', 'unidades', 'vehiculos', 'optimizacion'],
  operacion:   ['operacion', 'gps', 'geocercas', 'en vivo', 'tiempo real'],
  seguridad:   ['seguridad', 'oficiales', 'guardias', 'puestos', 'rondines'],
  custodia:    ['custodia', 'custodias', 'valores', 'cadena de custodia', 'evidencia'],
  alarmas:     ['alarmas', 'monitoreo', 'panico', 'intrusion', 'central'],
  transporte:  ['transporte', 'mercancias', 'embarques', 'carga'],
  incidencias: ['incidencias', 'excepciones', 'problemas'],
  analitica:   ['analitica', 'sla', 'cumplimiento', 'rentabilidad'],
  facturacion: ['facturacion', 'cobro', 'facturas', 'crm'],
  portal:      ['portal', 'cliente', 'acceso cliente'],
  usuarios:    ['usuarios', 'permisos', 'auditoria', 'roles'],
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
    return { text: `Soy ${ia.nombre}, el asistente de operación de BBOX Security. Conozco las ${SECCIONES.length} secciones de la plataforma. Puedes pedirme que te lleve a una ("ve a Incidencias"), preguntarme qué hace cualquiera de ellas, o consultarme servicios de hoy, cumplimiento de SLA o incidencias abiertas.` };
  }

  // ── Mapa de secciones ──
  if (/(que secciones|cuantas secciones|que hay en la plataforma|menu|navegacion|secciones)/.test(t) && !seccionMencionada(t)) {
    const lista = secciones.map(s => `· ${s.nombre} — ${tituloEstado[s.estado].toLowerCase()}`).join('\n');
    return { text: `La plataforma tiene ${secciones.length} secciones:\n${lista}\nPregúntame por cualquiera para el detalle, o dime "ve a…" para abrirla.` };
  }

  // ── Qué hace una sección concreta ──
  const sec = seccionMencionada(t);
  if (sec && /(que es|que hace|para que|que veo|que hay en|explicame|de que trata|como funciona|que tiene)/.test(t)) {
    const meta = secciones.find(x => x.id === sec.id)!;
    return { text: `${meta.nombre}: ${meta.descripcion} (${tituloEstado[meta.estado].toLowerCase()}). Dime "ve a ${meta.nombre}" y te llevo.` };
  }

  // ── Servicios de hoy ──
  if (/(servicios hoy|cuantos servicios|servicios del dia|cuantos hay hoy)/.test(t)) {
    const resumen = SERVICIOS_POR_ESTATUS.map(s => `${s.total} ${s.estatus.toLowerCase()}`).join(', ');
    return { text: `Hoy hay ${KPIS_HOY.serviciosHoy} servicios: ${resumen}. Dime "ve a Servicios" para el detalle y el calendario.` };
  }

  // ── Cumplimiento de SLA ──
  if (/(sla|cumplimiento)/.test(t)) {
    const mejor = SLA_POR_CLIENTE.reduce((a, b) => a.cumplimiento > b.cumplimiento ? a : b);
    const peor = SLA_POR_CLIENTE.reduce((a, b) => a.cumplimiento < b.cumplimiento ? a : b);
    return { text: `El cumplimiento de SLA promedio es ${KPIS_HOY.cumplimientoSLA}%. ${mejor.cliente} tiene el mejor cumplimiento (${mejor.cumplimiento}%) y ${peor.cliente} el más bajo (${peor.cumplimiento}%). Dime "ve a Analítica" para el desglose.` };
  }

  // ── Incidencias ──
  if (/(incidencias|excepciones|problemas|que paso|novedades|urgente|pendientes)/.test(t)) {
    const abiertas = INCIDENCIAS.filter(i => i.estatus !== 'Resuelta');
    const altas = abiertas.filter(i => i.severidad === 'Alta');
    return {
      text: abiertas.length === 0
        ? 'No hay incidencias abiertas en este momento.'
        : `Hay ${abiertas.length} incidencias abiertas, ${altas.length} de severidad alta. La más reciente: ${abiertas[0].descripcion} (servicio ${abiertas[0].servicio}). Revísalas en Incidencias.`,
    };
  }

  // ── Productividad ──
  if (/(productividad|unidad|por unidad)/.test(t)) {
    return { text: `La productividad promedio es de ${KPIS_HOY.productividadPorUnidad} servicios por unidad al día. Dime "ve a Rutas y Flota" para ver el detalle por unidad.` };
  }

  // ── Qué está vivo y qué es demo ──
  if (/(demo|en vivo|real|conectado|que funciona|estado de la plataforma|activo)/.test(t)) {
    const demo = secciones.filter(s => s.estado === 'demo').length;
    return { text: `Todas las secciones corren hoy con datos de demostración (${demo} en total) mientras se conecta cada backend. En el menú lateral cada sección lleva su punto de color: ámbar demo, gris en activación.` };
  }

  return {
    text: `Puedo llevarte a cualquiera de las ${SECCIONES.length} secciones ("ve a Incidencias"), explicarte qué hace cada una, o contarte cuántos servicios hay hoy, cómo va el cumplimiento de SLA o qué incidencias están abiertas.`,
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
