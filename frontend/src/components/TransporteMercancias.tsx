import React from 'react';
import { Truck, PackageCheck, PackageSearch, AlertTriangle } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { EMBARQUES, type EstatusEmbarque } from '../data/transporteMercancias';

const COLOR_ESTATUS: Record<EstatusEmbarque, string> = {
  'En origen': '#9CA3AF',
  'En tránsito': '#F59E0B',
  Entregado: '#10B981',
  Incidencia: '#EF4444',
};

export const TransporteMercancias: React.FC = () => {
  const { colores } = brandingConfig;

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  const enTransito = EMBARQUES.filter(e => e.estatus === 'En tránsito').length;
  const entregados = EMBARQUES.filter(e => e.estatus === 'Entregado').length;
  const incidencias = EMBARQUES.filter(e => e.estatus === 'Incidencia').length;

  const kpis = [
    { icono: Truck, label: 'Embarques hoy', valor: EMBARQUES.length.toString() },
    { icono: PackageSearch, label: 'En tránsito', valor: enTransito.toString() },
    { icono: PackageCheck, label: 'Entregados', valor: entregados.toString() },
    { icono: AlertTriangle, label: 'Con incidencia', valor: incidencias.toString(), alerta: incidencias > 0 },
  ];

  return (
    <div style={{ padding: 28, maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...cardStyle, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <k.icono size={18} color={k.alerta ? colores.peligro : colores.primario} />
              <span style={{ fontSize: 13, color: colores.textoOscuro, fontWeight: 600 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.alerta ? colores.peligro : colores.textoClaro }}>{k.valor}</div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${colores.borde}` }}>
          <Truck size={18} color={colores.primario} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>Embarques</h3>
        </div>
        {EMBARQUES.map(e => (
          <div key={e.folio} style={{ padding: '14px 20px', borderBottom: `1px solid ${colores.borde}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{e.cliente}</div>
                <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>{e.folio} · {e.tipoCarga} · unidad {e.unidad}</div>
              </div>
              <div style={{ fontSize: 13, color: colores.textoMedio, minWidth: 220 }}>
                {e.origen} → {e.destino}
              </div>
              <div style={{ fontSize: 12, color: colores.textoOscuro, minWidth: 110 }}>
                {e.horaSalida} → {e.horaEstimadaLlegada}
              </div>
              <span style={{
                fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                color: '#fff', background: COLOR_ESTATUS[e.estatus], flexShrink: 0,
              }}>
                {e.estatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
