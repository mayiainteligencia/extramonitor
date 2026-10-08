import React, { useState } from 'react';
import { Siren, Radar, Clock, BadgeCheck } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { useConfirm } from './shared/confirm';
import { EVENTOS_ALARMA, type EventoAlarma, type EstatusAlarma } from '../data/alarmas';

const COLOR_ESTATUS: Record<EstatusAlarma, string> = { Activa: '#EF4444', Atendida: '#10B981', 'Falsa alarma': '#9CA3AF' };

export const MonitoreoAlarmas: React.FC = () => {
  const { colores } = brandingConfig;
  const { push } = useToast();
  const confirmar = useConfirm();
  const [eventos, setEventos] = useState<EventoAlarma[]>(EVENTOS_ALARMA);

  const activas = eventos.filter(e => e.estatus === 'Activa');
  const atendidas = eventos.filter(e => e.tiempoRespuestaMin !== null);
  const tiempoPromedio = atendidas.length
    ? Math.round(atendidas.reduce((a, e) => a + (e.tiempoRespuestaMin ?? 0), 0) / atendidas.length)
    : 0;
  const falsas = eventos.filter(e => e.estatus === 'Falsa alarma').length;
  const falsasPct = Math.round((falsas / eventos.length) * 100);

  const despachar = async (ev: EventoAlarma) => {
    const ok = await confirmar({ titulo: `Despachar unidad a ${ev.cliente}`, descripcion: `Se notificará a la unidad más cercana para atender la alarma en ${ev.ubicacion}.`, confirmLabel: 'Despachar' });
    if (!ok) return;
    setEventos(prev => prev.map(e => e.id === ev.id ? { ...e, estatus: 'Atendida', tiempoRespuestaMin: 4 } : e));
    push({ kind: 'success', title: 'Unidad despachada', msg: `${ev.id} marcada como atendida.` });
  };

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  const kpis = [
    { icono: Siren, label: 'Alarmas activas', valor: activas.length.toString(), alerta: activas.length > 0 },
    { icono: Clock, label: 'Tiempo de respuesta prom.', valor: `${tiempoPromedio} min` },
    { icono: BadgeCheck, label: 'Falsas alarmas', valor: `${falsasPct}%` },
    { icono: Radar, label: 'Eventos hoy', valor: eventos.length.toString() },
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
          <Siren size={18} color={colores.primario} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>Central de monitoreo</h3>
        </div>
        {eventos.map(e => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: `1px solid ${colores.borde}`, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{e.cliente}</div>
              <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>{e.id} · {e.ubicacion} · {e.tipo} · {e.hora}</div>
            </div>
            <span style={{
              fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
              color: '#fff', background: COLOR_ESTATUS[e.estatus], flexShrink: 0,
            }}>
              {e.estatus}
            </span>
            {e.tiempoRespuestaMin !== null && (
              <span style={{ fontSize: 12, color: colores.textoOscuro, minWidth: 90 }}>{e.tiempoRespuestaMin} min resp.</span>
            )}
            {e.estatus === 'Activa' && (
              <button
                onClick={() => despachar(e)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8,
                  border: 'none', background: colores.primario, color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Despachar unidad
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
