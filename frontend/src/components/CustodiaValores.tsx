import React, { useState } from 'react';
import { ShieldCheck, FileCheck2, CircleCheck, CircleAlert } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { EXPEDIENTES, type EstatusExpediente } from '../data/custodia';

const COLOR_ESTATUS: Record<EstatusExpediente, string> = {
  'En custodia': '#F59E0B',
  Entregado: '#10B981',
  Incidencia: '#EF4444',
};

const fmtMXN = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const CustodiaValores: React.FC = () => {
  const { colores } = brandingConfig;
  const [seleccionado, setSeleccionado] = useState(EXPEDIENTES[0].folio);
  const expediente = EXPEDIENTES.find(e => e.folio === seleccionado) ?? EXPEDIENTES[0];

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16, padding: 20,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 0.8fr) minmax(0, 1.4fr)', gap: 16, alignItems: 'start' }}>
        {/* Lista de expedientes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EXPEDIENTES.map(e => {
            const activo = e.folio === seleccionado;
            return (
              <div
                key={e.folio}
                onClick={() => setSeleccionado(e.folio)}
                style={{
                  ...cardStyle, padding: '14px 16px', cursor: 'pointer',
                  border: `1px solid ${activo ? colores.primario : colores.borde}`,
                  background: activo ? `${colores.primario}0D` : colores.fondoClaro,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{e.folio}</span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: '#fff', padding: '3px 8px', borderRadius: 999,
                    background: COLOR_ESTATUS[e.estatus], flexShrink: 0,
                  }}>
                    {e.estatus}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: colores.textoOscuro }}>{e.cliente}</div>
                <div style={{ fontSize: 12.5, color: colores.textoMedio, marginTop: 6, fontWeight: 600 }}>{fmtMXN(e.valorDeclarado)}</div>
              </div>
            );
          })}
        </div>

        {/* Cadena de custodia */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: `${colores.primario}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ShieldCheck size={20} color={colores.primario} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: colores.textoClaro }}>{expediente.cliente}</h3>
              <div style={{ fontSize: 12.5, color: colores.textoOscuro }}>{expediente.folio} · valor declarado {fmtMXN(expediente.valorDeclarado)}</div>
            </div>
            <span style={{
              fontSize: 11.5, fontWeight: 700, color: '#fff', padding: '5px 12px', borderRadius: 999,
              background: COLOR_ESTATUS[expediente.estatus],
            }}>
              {expediente.estatus}
            </span>
          </div>

          {/* Timeline de eventos */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {expediente.eventos.map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {ev.confirmado
                    ? <CircleCheck size={22} color={colores.exito} />
                    : <CircleAlert size={22} color={colores.peligro} />}
                  {i < expediente.eventos.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 32, background: colores.borde, margin: '4px 0' }} />
                  )}
                </div>
                <div style={{ paddingBottom: 20, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{ev.tipo}</span>
                    <span style={{ fontSize: 12, color: colores.textoOscuro }}>{ev.hora}</span>
                    {!ev.confirmado && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: colores.peligro }}>sin confirmar</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: colores.textoMedio, marginTop: 2 }}>{ev.responsable}</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
                    fontSize: 11.5, color: colores.textoOscuro, background: colores.fondoSecundario,
                    padding: '5px 10px', borderRadius: 999,
                  }}>
                    <FileCheck2 size={13} /> {ev.evidencia.tipo} · {ev.evidencia.folio}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
