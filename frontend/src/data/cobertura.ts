// Cobertura de verificación: % de spots contratados que Verificación On-Air
// confirmó al aire, por semana. Dato simulado — fuente futura: cruce entre
// Verificación On-Air y la etapa "Cruce de Entregas" del Motor de Ingesta.
// Granularidad semanal, últimas 12 semanas.

export interface SemanaCobertura {
  semana: string;       // "S1".."S12"
  contratados: number;
  verificados: number;
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const SERIE_COBERTURA: SemanaCobertura[] = Array.from({ length: 12 }, (_, i) => {
  const semana = `S${i + 1}`;
  const contratados = 380 + (hash(semana) % 60);
  const faltantes = 8 + (hash(semana + 'f') % 22);
  return { semana, contratados, verificados: contratados - faltantes };
});

export const coberturaPct = (s: SemanaCobertura) => Math.round((s.verificados / s.contratados) * 1000) / 10;
