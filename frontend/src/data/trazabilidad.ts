// Cifras con linaje completo para Trazabilidad y Auditoría. Vive aquí para
// que Tablero y la sección lean la misma fuente. Dato simulado — la forma es
// real: toda cifra debe responder de qué proveedor viene, con qué timestamp,
// bajo qué metodología, y quién la impugna.
import { ULTIMO, fmtMXNCorto, porPeriodo } from './media';

export interface CifraTrazada {
  cifra: string;
  valor: string;
  origen: string;
  proveedor: string;
  timestamp: string;
  metodologia: string;
  versionCorta: string;
  impugnable: boolean;
}

const D = porPeriodo[ULTIMO];

export const CIFRAS: CifraTrazada[] = [
  { cifra: 'Inversión total de industria', valor: fmtMXNCorto(D.inversionTotal), origen: 'Motor de Ingesta · etapa Cruce de Entregas', proveedor: 'HR Media', timestamp: `${ULTIMO}-12-01 06:40`, metodologia: 'v3.2 (vigente desde 2025-06)', versionCorta: 'v3.2', impugnable: true },
  { cifra: 'GRPs de industria', valor: `${D.grpsTotal.toLocaleString('es-MX')}`, origen: 'Motor de Ingesta · etapa Cruce de Entregas', proveedor: 'HR Media', timestamp: `${ULTIMO}-12-01 06:40`, metodologia: 'v3.2 (vigente desde 2025-06)', versionCorta: 'v3.2', impugnable: true },
  { cifra: 'Alcance promedio', valor: `${D.alcanceProm}%`, origen: 'Modelo de Mix de Medios', proveedor: 'HR Media', timestamp: `${ULTIMO}-12-01 07:10`, metodologia: 'v3.2 (vigente desde 2025-06)', versionCorta: 'v3.2', impugnable: true },
  { cifra: 'Score de oportunidad OOH (promedio)', valor: 'ver Censo OOH', origen: 'Modelo de Oportunidad OOH', proveedor: 'Datalab ACAM (interno)', timestamp: `${ULTIMO}-12-01 05:20`, metodologia: 'v1.0 (beta)', versionCorta: 'v1.0 (interno)', impugnable: false },
  { cifra: 'Caso CC-101 · delta de spots', valor: '6 spots', origen: 'Verificación On-Air', proveedor: 'Monitoreo propio ACAM', timestamp: `${ULTIMO}-12-02 08:15`, metodologia: 'Transcripción Whisper + cruce de pauta', versionCorta: 'Whisper v1', impugnable: true },
  { cifra: 'Inversión CTV', valor: fmtMXNCorto(D.inversionPorMedio['CTV']), origen: 'Modelo de Mix de Medios', proveedor: 'HR Media', timestamp: `${ULTIMO}-12-01 07:10`, metodologia: 'v3.2 (vigente desde 2025-06)', versionCorta: 'v3.2', impugnable: true },
];
