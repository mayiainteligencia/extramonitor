import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, Plus } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { INCIDENCIAS, type Incidencia, type EstatusIncidencia, type SeveridadIncidencia } from '../data/incidencias';

const COLOR_SEVERIDAD: Record<SeveridadIncidencia, string> = { Alta: '#EF4444', Media: '#F59E0B', Baja: '#9CA3AF' };
const COLOR_ESTATUS: Record<EstatusIncidencia, string> = { Abierta: '#EF4444', 'En revisión': '#F59E0B', Resuelta: '#10B981' };
const ESTATUS_OPCIONES: EstatusIncidencia[] = ['Abierta', 'En revisión', 'Resuelta'];
const FILTROS: ('Todas' | EstatusIncidencia)[] = ['Todas', 'Abierta', 'En revisión', 'Resuelta'];

export const Incidencias: React.FC = () => {
  const { colores } = brandingConfig;
  const { push } = useToast();
  const [incidencias, setIncidencias] = useState<Incidencia[]>(INCIDENCIAS);
  const [filtro, setFiltro] = useState<'Todas' | EstatusIncidencia>('Todas');
  const [expandido, setExpandido] = useState<string | null>(INCIDENCIAS[0].folio);
  const [notaNueva, setNotaNueva] = useState('');

  const filtradas = filtro === 'Todas' ? incidencias : incidencias.filter(i => i.estatus === filtro);

  const cambiarEstatus = (folio: string, estatus: EstatusIncidencia) => {
    setIncidencias(prev => prev.map(i => i.folio === folio ? { ...i, estatus } : i));
    push({ kind: estatus === 'Resuelta' ? 'success' : 'info', title: 'Incidencia actualizada', msg: `${folio} ahora está ${estatus.toLowerCase()}.` });
  };

  const agregarNota = (folio: string) => {
    if (!notaNueva.trim()) return;
    const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    setIncidencias(prev => prev.map(i => i.folio === folio
      ? { ...i, seguimiento: [...i.seguimiento, { hora, autor: 'Tú', nota: notaNueva.trim() }] }
      : i));
    setNotaNueva('');
  };

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap' }}>
          {FILTROS.map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${filtro === f ? colores.primario : colores.borde}`,
                background: filtro === f ? colores.primario : colores.fondoClaro,
                color: filtro === f ? '#fff' : colores.textoMedio,
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => push({ kind: 'alert', title: 'Nueva incidencia', msg: 'Formulario de registro pendiente de backend.' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10,
            border: 'none', background: colores.primario, color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Registrar incidencia
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtradas.map(inc => {
          const abierto = expandido === inc.folio;
          return (
            <div key={inc.folio} style={{ ...cardStyle, overflow: 'hidden' }}>
              <div
                onClick={() => setExpandido(abierto ? null : inc.folio)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer' }}
              >
                <AlertTriangle size={18} color={COLOR_SEVERIDAD[inc.severidad]} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{inc.descripcion}</div>
                  <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>
                    {inc.folio} · servicio {inc.servicio} · {inc.responsable} · {inc.fecha} {inc.hora}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 999, color: '#fff',
                  background: COLOR_SEVERIDAD[inc.severidad], flexShrink: 0,
                }}>
                  {inc.severidad}
                </span>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999, color: '#fff',
                  background: COLOR_ESTATUS[inc.estatus], flexShrink: 0,
                }}>
                  {inc.estatus}
                </span>
                <ChevronDown size={16} color={colores.textoOscuro}
                  style={{ transform: abierto ? 'rotate(180deg)' : 'none', transition: 'transform .15s', flexShrink: 0 }} />
              </div>

              {abierto && (
                <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${colores.borde}` }}>
                  {/* Cambiar estatus */}
                  <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
                    {ESTATUS_OPCIONES.map(op => (
                      <button
                        key={op}
                        onClick={() => cambiarEstatus(inc.folio, op)}
                        disabled={op === inc.estatus}
                        style={{
                          padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          border: `1px solid ${op === inc.estatus ? COLOR_ESTATUS[op] : colores.borde}`,
                          background: op === inc.estatus ? `${COLOR_ESTATUS[op]}18` : colores.fondoClaro,
                          color: op === inc.estatus ? COLOR_ESTATUS[op] : colores.textoMedio,
                          cursor: op === inc.estatus ? 'default' : 'pointer',
                        }}
                      >
                        Marcar {op.toLowerCase()}
                      </button>
                    ))}
                  </div>

                  {/* Seguimiento */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                    {inc.seguimiento.map((s, i) => (
                      <div key={i} style={{ paddingLeft: 10, borderLeft: `2px solid ${colores.borde}` }}>
                        <div style={{ fontSize: 12.5, color: colores.textoMedio }}>{s.nota}</div>
                        <div style={{ fontSize: 11, color: colores.textoOscuro, marginTop: 2 }}>{s.autor} · {s.hora}</div>
                      </div>
                    ))}
                  </div>

                  {/* Agregar nota */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={notaNueva}
                      onChange={e => setNotaNueva(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && agregarNota(inc.folio)}
                      placeholder="Agregar nota de seguimiento…"
                      style={{
                        flex: 1, padding: '8px 12px', borderRadius: 8, border: `1px solid ${colores.borde}`,
                        fontSize: 13, outline: 'none', color: colores.textoClaro,
                      }}
                    />
                    <button
                      onClick={() => agregarNota(inc.folio)}
                      style={{
                        padding: '8px 14px', borderRadius: 8, border: 'none', background: colores.primario,
                        color: '#fff', fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
