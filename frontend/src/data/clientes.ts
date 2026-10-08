// Datos mock de Gestión de Clientes. Al conectar backend real se reemplaza por /api/clientes.

export type EstatusCliente = 'Prospecto' | 'Activo' | 'Inactivo';
export type NivelRiesgo = 'Bajo' | 'Medio' | 'Alto';

export interface Contacto {
  nombre: string;
  puesto: string;
  telefono: string;
  email: string;
}

export interface Sucursal {
  nombre: string;
  domicilio: string;
  ciudad: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  categoria: string;
  estatus: EstatusCliente;
  riesgo: NivelRiesgo;
  condicionesServicio: string;
  sucursales: Sucursal[];
  contactos: Contacto[];
}

export const CLIENTES: Cliente[] = [
  {
    id: 'CLI-001',
    nombre: 'Banco Genérico',
    categoria: 'Banca',
    estatus: 'Activo',
    riesgo: 'Bajo',
    condicionesServicio: 'Recolección diaria 08:00–10:00 h. Póliza de seguro de carga $1,500,000 MXN. Doble custodio obligatorio.',
    sucursales: [
      { nombre: 'Sucursal Centro', domicilio: 'Av. Juárez 123', ciudad: 'Guadalajara' },
      { nombre: 'Sucursal Américas', domicilio: 'Av. Américas 1500', ciudad: 'Guadalajara' },
    ],
    contactos: [
      { nombre: 'Laura Mendoza', puesto: 'Gerente de Operaciones', telefono: '33 1234 5678', email: 'lmendoza@bancogenerico.mx' },
    ],
  },
  {
    id: 'CLI-002',
    nombre: 'Farmacia Genérica',
    categoria: 'Farmacia',
    estatus: 'Activo',
    riesgo: 'Medio',
    condicionesServicio: 'Recolección recurrente lunes, miércoles y viernes 18:00 h. Entrega de reporte de cierre mismo día.',
    sucursales: [
      { nombre: 'Sucursal #212', domicilio: 'Calz. Independencia 800', ciudad: 'Guadalajara' },
      { nombre: 'Sucursal #340', domicilio: 'Av. Patria 2200', ciudad: 'Zapopan' },
    ],
    contactos: [
      { nombre: 'Jorge Ramírez', puesto: 'Supervisor Regional', telefono: '33 2345 6789', email: 'jramirez@farmaciagenerica.mx' },
    ],
  },
  {
    id: 'CLI-003',
    nombre: 'Abarrotes Zona Industrial',
    categoria: 'Retail / Conveniencia',
    estatus: 'Activo',
    riesgo: 'Medio',
    condicionesServicio: 'Servicio ordinario bajo demanda, aviso con 2 h de anticipación. Evidencia fotográfica obligatoria.',
    sucursales: [
      { nombre: 'CEDIS Zona Industrial', domicilio: 'Periférico Norte 4500', ciudad: 'Guadalajara' },
    ],
    contactos: [
      { nombre: 'Patricia Luna', puesto: 'Coordinadora de Seguridad', telefono: '33 3456 7890', email: 'pluna@abarrotes.mx' },
    ],
  },
  {
    id: 'CLI-004',
    nombre: 'Supermercado Genérico Plaza del Sol',
    categoria: 'Retail / Autoservicio',
    estatus: 'Activo',
    riesgo: 'Alto',
    condicionesServicio: 'Servicios extraordinarios en quincena y fin de mes. Requiere 2 unidades blindadas simultáneas.',
    sucursales: [
      { nombre: 'Hiper Plaza del Sol', domicilio: 'Av. López Mateos Sur 2375', ciudad: 'Guadalajara' },
    ],
    contactos: [
      { nombre: 'Miguel Torres', puesto: 'Gerente de Tienda', telefono: '33 4567 8901', email: 'mtorres@supermercadogenerico.mx' },
    ],
  },
  {
    id: 'CLI-005',
    nombre: 'Clínica Genérica',
    categoria: 'Salud',
    estatus: 'Prospecto',
    riesgo: 'Bajo',
    condicionesServicio: 'En evaluación: recolección semanal propuesta, pendiente definir horario y póliza.',
    sucursales: [
      { nombre: 'Hospital Genérico', domicilio: 'Av. Pablo Casals 640', ciudad: 'Zapopan' },
    ],
    contactos: [
      { nombre: 'Adriana Flores', puesto: 'Administradora', telefono: '33 5678 9012', email: 'aflores@clinicagenerica.mx' },
    ],
  },
  {
    id: 'CLI-006',
    nombre: 'Tienda de Conveniencia Chapultepec',
    categoria: 'Retail / Autoservicio',
    estatus: 'Inactivo',
    riesgo: 'Medio',
    condicionesServicio: 'Contrato suspendido desde renovación de proveedor local. Pendiente reactivación.',
    sucursales: [
      { nombre: 'Express Chapultepec', domicilio: 'Av. Chapultepec Sur 198', ciudad: 'Guadalajara' },
    ],
    contactos: [
      { nombre: 'Héctor Vargas', puesto: 'Gerente Regional', telefono: '33 6789 0123', email: 'hvargas@convenienciagenerica.mx' },
    ],
  },
];
