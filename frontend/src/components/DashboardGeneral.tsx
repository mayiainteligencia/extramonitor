import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from 'recharts';
import { ClipboardCheck, AlertTriangle, Gauge, Truck } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { HeroCard } from './modules/dashboardModules/Herocard';
import {
  KPIS_HOY, SERVICIOS_POR_ESTATUS, SLA_7_DIAS, SERVICIOS_RECIENTES, INCIDENCIAS_RECIENTES,
  type EstatusServicio,
} from '../data/operaciones';

const COLOR_ESTATUS: Record<EstatusServicio, string> = {
  Programado: '#9CA3AF',
  'En ruta': '#F59E0B',
  Atendido: '#3B82F6',
  Cerrado: '#10B981',
  'No realizado': '#EF4444',
};

const COLOR_SEVERIDAD = { Alta: '#EF4444', Media: '#F59E0B', Baja: '#9CA3AF' } as const;

interface DashboardGeneralProps {
  onSectionChange?: (section: string) => void;
}

export const DashboardGeneral: React.FC<DashboardGeneralProps> = ({ onSectionChange }) => {
  const { colores } = brandingConfig;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const kpis = [
    { icono: Truck, label: 'Servicios hoy', valor: KPIS_HOY.serviciosHoy.toString() },
    { icono: Gauge, label: 'Cumplimiento SLA', valor: `${KPIS_HOY.cumplimientoSLA}%` },
    { icono: AlertTriangle, label: 'Incidencias abiertas', valor: KPIS_HOY.incidenciasAbiertas.toString(), alerta: KPIS_HOY.incidenciasAbiertas > 0 },
    { icono: ClipboardCheck, label: 'Servicios / unidad', valor: KPIS_HOY.productividadPorUnidad.toString() },
  ];

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro,
    borderRadius: 16,
    padding: 24,
    border: `1px solid ${colores.borde}`,
    boxShadow: colores.sombra,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}>
      {/* KPIs + MAYIA a su derecha, igual que el War Room */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.55fr 1fr',
        gap: isMobile ? 16 : 24,
        marginBottom: 24,
        alignItems: 'stretch',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {kpis.map(k => (
            <div key={k.label} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <k.icono size={18} color={k.alerta ? colores.peligro : colores.primario} />
                <span style={{ fontSize: 13, color: colores.textoOscuro, fontWeight: 600 }}>{k.label}</span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: k.alerta ? colores.peligro : colores.textoClaro }}>
                {k.valor}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: isMobile ? 300 : 'auto', minHeight: isMobile ? 0 : 260 }}>
          <HeroCard onNavigate={onSectionChange} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
        {/* Cumplimiento de SLA */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colores.textoClaro }}>
            Cumplimiento de SLA — últimos 7 días
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={SLA_7_DIAS}>
              <CartesianGrid strokeDasharray="4 4" stroke={colores.borde} />
              <XAxis dataKey="dia" stroke={colores.textoOscuro} fontSize={12} />
              <YAxis domain={[85, 100]} stroke={colores.textoOscuro} fontSize={12} unit="%" width={44} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Cumplimiento']} />
              <Line type="monotone" dataKey="cumplimiento" stroke={colores.primario} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Servicios por estatus */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colores.textoClaro }}>
            Servicios por estatus
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={SERVICIOS_POR_ESTATUS} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid strokeDasharray="4 4" stroke={colores.borde} horizontal={false} />
              <XAxis type="number" stroke={colores.textoOscuro} fontSize={12} />
              <YAxis type="category" dataKey="estatus" stroke={colores.textoOscuro} fontSize={12} width={90} />
              <Tooltip />
              <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                {SERVICIOS_POR_ESTATUS.map(s => (
                  <Cell key={s.estatus} fill={COLOR_ESTATUS[s.estatus]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 16 }}>
        {/* Servicios recientes */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colores.textoClaro }}>
            Servicios recientes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SERVICIOS_RECIENTES.map(s => (
              <div key={s.folio} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 4px', borderBottom: `1px solid ${colores.borde}`,
              }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: colores.textoClaro }}>{s.cliente}</div>
                  <div style={{ fontSize: 12, color: colores.textoOscuro }}>{s.folio} · {s.tipo} · {s.unidad} · {s.hora}</div>
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                  color: '#fff', background: COLOR_ESTATUS[s.estatus],
                }}>
                  {s.estatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Incidencias recientes */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colores.textoClaro }}>
            Incidencias recientes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {INCIDENCIAS_RECIENTES.map(i => (
              <div key={i.folio} style={{ paddingLeft: 10, borderLeft: `3px solid ${COLOR_SEVERIDAD[i.severidad]}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colores.textoClaro }}>{i.descripcion}</div>
                <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>
                  {i.folio} · servicio {i.servicio} · {i.hora} · severidad {i.severidad}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
