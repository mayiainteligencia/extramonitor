// Datos mock de Usuarios y Auditoría. Al conectar backend real se reemplaza por /api/usuarios y /api/auditoria.

export type RolUsuario = 'Operaciones' | 'Administración' | 'Supervisión';

export interface Usuario {
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  ultimoAcceso: string;
}

export interface EventoAuditoria {
  hora: string;
  usuario: string;
  accion: string;
  detalle: string;
}

export const USUARIOS: Usuario[] = [
  { nombre: 'Laura Mendoza',  email: 'lmendoza@bbox.com', rol: 'Administración', activo: true,  ultimoAcceso: '2026-10-08 09:40' },
  { nombre: 'Jorge Ramírez',  email: 'jramirez@bbox.com',  rol: 'Operaciones',    activo: true,  ultimoAcceso: '2026-10-08 08:55' },
  { nombre: 'Patricia Luna',  email: 'pluna@bbox.com',     rol: 'Supervisión',    activo: true,  ultimoAcceso: '2026-10-08 08:10' },
  { nombre: 'Miguel Torres',  email: 'mtorres@bbox.com',   rol: 'Operaciones',    activo: false, ultimoAcceso: '2026-09-30 17:22' },
  { nombre: 'Adriana Flores', email: 'aflores@bbox.com',   rol: 'Administración', activo: true,  ultimoAcceso: '2026-10-07 14:05' },
];

export const AUDITORIA: EventoAuditoria[] = [
  { hora: '2026-10-08 09:42', usuario: 'Laura Mendoza', accion: 'Reprogramó servicio', detalle: 'SV-10464 movido a 2026-10-10 09:15' },
  { hora: '2026-10-08 09:20', usuario: 'Jorge Ramírez',  accion: 'Cerró incidencia',    detalle: 'INC-0230 marcada como Resuelta' },
  { hora: '2026-10-08 08:55', usuario: 'Jorge Ramírez',  accion: 'Generó factura',      detalle: 'SV-10439 facturado por $1,850 MXN' },
  { hora: '2026-10-08 08:30', usuario: 'Patricia Luna',  accion: 'Confirmó entrega',    detalle: 'Expediente SV-10450 marcado como Entregado' },
  { hora: '2026-10-07 14:10', usuario: 'Adriana Flores', accion: 'Dio de alta cliente', detalle: 'Clínica Genérica registrado como Prospecto' },
];
