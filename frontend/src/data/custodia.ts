// Datos mock de Custodia de Valores (control de valores, cadena de custodia, evidencia digital).
// Al conectar backend real se reemplaza por /api/custodia.

export type TipoEventoCustodia = 'Recepción' | 'Traslado' | 'Entrega';
export type TipoEvidencia = 'Firma digital' | 'Foto' | 'Sello de seguridad';
export type EstatusExpediente = 'En custodia' | 'Entregado' | 'Incidencia';

export interface EventoCustodia {
  tipo: TipoEventoCustodia;
  responsable: string;
  hora: string;
  confirmado: boolean;
  evidencia: { folio: string; tipo: TipoEvidencia };
}

export interface ExpedienteValor {
  folio: string;
  cliente: string;
  valorDeclarado: number;
  estatus: EstatusExpediente;
  eventos: EventoCustodia[];
}

export const EXPEDIENTES: ExpedienteValor[] = [
  {
    folio: 'SV-10460',
    cliente: 'Banco Genérico Sucursal Centro',
    valorDeclarado: 850_000,
    estatus: 'En custodia',
    eventos: [
      { tipo: 'Recepción', responsable: 'Ismael Cortés (custodio)', hora: '09:42', confirmado: true, evidencia: { folio: 'EV-5201', tipo: 'Firma digital' } },
      { tipo: 'Traslado', responsable: 'Raúl Pérez (conductor)', hora: '09:45', confirmado: true, evidencia: { folio: 'EV-5202', tipo: 'Sello de seguridad' } },
    ],
  },
  {
    folio: 'SV-10451',
    cliente: 'Farmacia Genérica #212',
    valorDeclarado: 142_500,
    estatus: 'Entregado',
    eventos: [
      { tipo: 'Recepción', responsable: 'Marco Salas (custodio)', hora: '08:50', confirmado: true, evidencia: { folio: 'EV-5190', tipo: 'Firma digital' } },
      { tipo: 'Traslado', responsable: 'Daniel Ruiz (conductor)', hora: '08:55', confirmado: true, evidencia: { folio: 'EV-5191', tipo: 'Sello de seguridad' } },
      { tipo: 'Entrega', responsable: 'Bóveda Sucursal Centro', hora: '09:15', confirmado: true, evidencia: { folio: 'EV-5192', tipo: 'Foto' } },
    ],
  },
  {
    folio: 'SV-10448',
    cliente: 'Banco Comercial Sucursal Américas',
    valorDeclarado: 610_000,
    estatus: 'Incidencia',
    eventos: [
      { tipo: 'Recepción', responsable: 'Omar Ibarra (custodio)', hora: '08:10', confirmado: true, evidencia: { folio: 'EV-5180', tipo: 'Firma digital' } },
      { tipo: 'Traslado', responsable: 'Sergio Lima (conductor)', hora: '08:14', confirmado: false, evidencia: { folio: 'EV-5181', tipo: 'Sello de seguridad' } },
    ],
  },
  {
    folio: 'SV-10450',
    cliente: 'Abarrotes Zona Industrial',
    valorDeclarado: 95_000,
    estatus: 'Entregado',
    eventos: [
      { tipo: 'Recepción', responsable: 'Víctor Reyes (custodio)', hora: '08:30', confirmado: true, evidencia: { folio: 'EV-5170', tipo: 'Firma digital' } },
      { tipo: 'Traslado', responsable: 'Luis Gómez (conductor)', hora: '08:34', confirmado: true, evidencia: { folio: 'EV-5171', tipo: 'Sello de seguridad' } },
      { tipo: 'Entrega', responsable: 'Bóveda CEDIS Zona Industrial', hora: '08:50', confirmado: true, evidencia: { folio: 'EV-5172', tipo: 'Foto' } },
    ],
  },
];
