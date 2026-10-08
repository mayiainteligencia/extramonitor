// Datos mock de Incidencias (registro y seguimiento de excepciones operativas).
// Al conectar backend real se reemplaza por /api/incidencias.

export type SeveridadIncidencia = 'Alta' | 'Media' | 'Baja';
export type EstatusIncidencia = 'Abierta' | 'En revisión' | 'Resuelta';

export interface NotaSeguimiento {
  hora: string;
  autor: string;
  nota: string;
}

export interface Incidencia {
  folio: string;
  descripcion: string;
  servicio: string;
  severidad: SeveridadIncidencia;
  estatus: EstatusIncidencia;
  responsable: string;
  fecha: string;
  hora: string;
  seguimiento: NotaSeguimiento[];
}

export const INCIDENCIAS: Incidencia[] = [
  {
    folio: 'INC-0231', descripcion: 'Retraso por cierre vial', servicio: 'SV-10448',
    severidad: 'Media', estatus: 'En revisión', responsable: 'Supervisión Zona Centro', fecha: '2026-10-08', hora: '08:05',
    seguimiento: [
      { hora: '08:05', autor: 'Sergio Lima (conductor)', nota: 'Vialidad cerrada por manifestación en Av. Américas, se toma ruta alterna.' },
      { hora: '08:20', autor: 'Supervisión', nota: 'Se notifica al cliente el retraso estimado de 25 min.' },
    ],
  },
  {
    folio: 'INC-0230', descripcion: 'Documentación incompleta', servicio: 'SV-10439',
    severidad: 'Baja', estatus: 'Resuelta', responsable: 'Administración', fecha: '2026-10-07', hora: '07:48',
    seguimiento: [
      { hora: '07:48', autor: 'Custodio', nota: 'Falta firma del responsable de bóveda en el acuse.' },
      { hora: '09:10', autor: 'Administración', nota: 'Se obtuvo firma complementaria, expediente cerrado.' },
    ],
  },
  {
    folio: 'INC-0229', descripcion: 'Unidad con falla mecánica menor', servicio: 'SV-10422',
    severidad: 'Alta', estatus: 'Abierta', responsable: 'Taller / Flota', fecha: '2026-10-07', hora: '07:10',
    seguimiento: [
      { hora: '07:10', autor: 'Raúl Pérez (conductor)', nota: 'Testigo de falla en el motor, unidad U-02 se detiene en ruta.' },
      { hora: '07:25', autor: 'Flota', nota: 'Se envía unidad de respaldo U-09 y grúa para U-02.' },
    ],
  },
  {
    folio: 'INC-0228', descripcion: 'Discrepancia en monto declarado', servicio: 'SV-10410',
    severidad: 'Alta', estatus: 'Abierta', responsable: 'Custodia / Cliente', fecha: '2026-10-06', hora: '12:40',
    seguimiento: [
      { hora: '12:40', autor: 'Custodio', nota: 'Monto recibido no coincide con el declarado por el cliente, diferencia de $3,500 MXN.' },
    ],
  },
  {
    folio: 'INC-0227', descripcion: 'Acceso denegado en sucursal', servicio: 'SV-10398',
    severidad: 'Media', estatus: 'Resuelta', responsable: 'Supervisión Zapopan', fecha: '2026-10-05', hora: '09:55',
    seguimiento: [
      { hora: '09:55', autor: 'Custodio', nota: 'Personal de la sucursal no reconoce la cita programada.' },
      { hora: '10:15', autor: 'Supervisión', nota: 'Se confirma cita con gerencia del cliente, servicio se reprograma el mismo día.' },
    ],
  },
];
