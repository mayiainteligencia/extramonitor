import React from 'react';
import { Navigation, Satellite, MapPinCheck, Gauge } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import {
  PIPELINE, SERVICIOS_PIPELINE, UNIDADES_EN_VIVO, EVENTOS_GEOCERCA,
  type EstatusPipeline,
} from '../data/operacionLive';

const COLOR_PIPELINE: Record<EstatusPipeline, string> = {
  Programado: '#9CA3AF',
  'En ruta': '#F59E0B',
  Atendido: '#3B82F6',
  Cerrado: '#10B981',
  'No realizado': '#EF4444',
};

export const OperacionVivo: React.FC = () => {
  const { colores } = brandingConfig;

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  const enRuta = SERVICIOS_PIPELINE.filter(s => s.estatus === 'En ruta').length;
  const atendidosHoy = SERVICIOS_PIPELINE.filter(s => s.estatus === 'Atendido' || s.estatus === 'Cerrado').length;

  const kpis = [
    { icono: Navigation, label: 'Unidades en ruta', valor: enRuta.toString() },
    { icono: Satellite, label: 'Unidades con GPS activo', valor: UNIDADES_EN_VIVO.length.toString() },
    { icono: MapPinCheck, label: 'Eventos de geocerca hoy', valor: EVENTOS_GEOCERCA.length.toString() },
    { icono: Gauge, label: 'Servicios atendidos hoy', valor: atendidosHoy.toString() },
  ];

  return (
    <div style={{ padding: 28, maxWidth: 1500, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...cardStyle, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <k.icono size={18} color={colores.primario} />
              <span style={{ fontSize: 13, color: colores.textoOscuro, fontWeight: 600 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: colores.textoClaro }}>{k.valor}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
        {/* Pipeline tipo kanban */}
        <div style={{ ...cardStyle, padding: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>
            Estatus del servicio
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PIPELINE.length}, minmax(140px, 1fr))`, gap: 10, overflowX: 'auto' }}>
            {PIPELINE.map(estatus => {
              const servicios = SERVICIOS_PIPELINE.filter(s => s.estatus === estatus);
              return (
                <div key={estatus} style={{ background: colores.fondoSecundario, borderRadius: 12, padding: 10, minHeight: 160 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLOR_PIPELINE[estatus] }} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: colores.textoMedio }}>{estatus} ({servicios.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {servicios.map(s => (
                      <div key={s.folio} style={{
                        background: colores.fondoClaro, borderRadius: 8, padding: '8px 10px',
                        border: `1px solid ${colores.borde}`,
                      }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: colores.textoClaro, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.cliente}
                        </div>
                        <div style={{ fontSize: 10.5, color: colores.textoOscuro, marginTop: 2 }}>{s.folio} · {s.unidad} · {s.hora}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Unidades con GPS activo */}
          <div style={{ ...cardStyle, padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>
              Unidades con GPS activo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {UNIDADES_EN_VIVO.map(u => (
                <div key={u.unidad} style={{ padding: '8px 0', borderBottom: `1px solid ${colores.borde}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: colores.textoClaro }}>{u.unidad}</span>
                    <span style={{ fontSize: 12, color: colores.textoOscuro }}>{u.velocidad} km/h</span>
                  </div>
                  <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>{u.cliente}</div>
                  <div style={{ fontSize: 11, color: colores.textoOscuro, marginTop: 2 }}>{u.ultimaActualizacion}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Eventos de geocerca */}
          <div style={{ ...cardStyle, padding: 20 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>
              Eventos de geocerca
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {EVENTOS_GEOCERCA.map(e => (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 999, color: '#fff',
                    background: e.tipo === 'Entrada' ? '#10B981' : '#9CA3AF', flexShrink: 0,
                  }}>
                    {e.tipo}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: colores.textoClaro, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.cliente}
                    </div>
                    <div style={{ fontSize: 11, color: colores.textoOscuro }}>{e.unidad} · {e.hora}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
