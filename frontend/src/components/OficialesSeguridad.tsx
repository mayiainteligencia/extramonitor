import React from 'react';
import { ShieldHalf, UserCheck, UserX, Footprints } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { PUESTOS, RONDINES, type EstatusPuesto } from '../data/seguridad';

const COLOR_PUESTO: Record<EstatusPuesto, string> = { Cubierto: '#10B981', 'En relevo': '#F59E0B', Descubierto: '#EF4444' };

export const OficialesSeguridad: React.FC = () => {
  const { colores } = brandingConfig;

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  const cubiertos = PUESTOS.filter(p => p.estatus === 'Cubierto').length;
  const descubiertos = PUESTOS.filter(p => p.estatus === 'Descubierto').length;
  const incidenciasRondin = RONDINES.filter(r => r.estatus === 'Con incidencia').length;

  const kpis = [
    { icono: ShieldHalf, label: 'Puestos totales', valor: PUESTOS.length.toString() },
    { icono: UserCheck, label: 'Puestos cubiertos', valor: cubiertos.toString() },
    { icono: UserX, label: 'Puestos descubiertos', valor: descubiertos.toString(), alerta: descubiertos > 0 },
    { icono: Footprints, label: 'Rondines con incidencia', valor: incidenciasRondin.toString(), alerta: incidenciasRondin > 0 },
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

      <div style={{ ...cardStyle, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${colores.borde}` }}>
          <ShieldHalf size={18} color={colores.primario} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>Puestos de seguridad</h3>
        </div>
        {PUESTOS.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: `1px solid ${colores.borde}`, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{p.cliente}</div>
              <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>{p.id} · {p.ubicacion} · turno {p.turno}</div>
            </div>
            <div style={{ fontSize: 13, color: colores.textoMedio, minWidth: 140 }}>
              {p.oficial}
              <div style={{ fontSize: 11, color: colores.textoOscuro }}>check-in {p.ultimoCheckIn}</div>
            </div>
            <span style={{
              fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
              color: '#fff', background: COLOR_PUESTO[p.estatus], flexShrink: 0,
            }}>
              {p.estatus}
            </span>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Footprints size={18} color={colores.primario} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>Rondines recientes</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RONDINES.map(r => (
            <div key={r.id} style={{
              paddingLeft: 10, borderLeft: `3px solid ${r.estatus === 'Completado' ? colores.exito : colores.peligro}`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colores.textoClaro }}>
                {r.puesto} · {r.oficial} · {r.estatus}
              </div>
              <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>{r.hora}{r.nota ? ` · ${r.nota}` : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
