import React, { useState, useMemo } from 'react';
import { CalendarClock, XCircle, CalendarCog, Plus, X } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { useConfirm } from './shared/confirm';
import { Calendario } from './shared/Calendario';
import { SERVICIOS_PROGRAMADOS, type TipoServicio, type EstatusProgramacion, type ServicioProgramado } from '../data/servicios';
import { CLIENTES } from '../data/clientes';
import { UNIDADES } from '../data/rutasFlota';

const COLOR_ESTATUS: Record<EstatusProgramacion, string> = {
  Programado: '#9CA3AF',
  Confirmado: '#10B981',
  Reprogramado: '#F59E0B',
  Cancelado: '#EF4444',
};

const TIPOS: ('Todos' | TipoServicio)[] = ['Todos', 'Ordinario', 'Recurrente', 'Extraordinario'];
let folioSeq = 10470;

export const Servicios: React.FC = () => {
  const { colores } = brandingConfig;
  const { push } = useToast();
  const confirmar = useConfirm();
  const [filtro, setFiltro] = useState<'Todos' | TipoServicio>('Todos');
  const [diaFiltro, setDiaFiltro] = useState('');
  const [servicios, setServicios] = useState<ServicioProgramado[]>(SERVICIOS_PROGRAMADOS);
  const [reprogramando, setReprogramando] = useState<string | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);

  const marcadores = useMemo(() => {
    const m: Record<string, number> = {};
    servicios.filter(s => s.estatus !== 'Cancelado').forEach(s => { m[s.fecha] = (m[s.fecha] ?? 0) + 1; });
    return m;
  }, [servicios]);

  const filtrados = servicios
    .filter(s => filtro === 'Todos' || s.tipo === filtro)
    .filter(s => !diaFiltro || s.fecha === diaFiltro);

  const cancelar = async (folio: string, cliente: string) => {
    const ok = await confirmar({
      titulo: `Cancelar ${folio}`,
      descripcion: `Se cancelará el servicio programado para ${cliente}. Esta acción notificará al cliente.`,
      confirmLabel: 'Cancelar servicio',
    });
    if (!ok) return;
    setServicios(prev => prev.map(s => s.folio === folio ? { ...s, estatus: 'Cancelado' } : s));
    push({ kind: 'alert', title: 'Servicio cancelado', msg: `${folio} se marcó como cancelado.` });
  };

  const abrirReprogramar = (s: ServicioProgramado) => {
    setReprogramando(s.folio);
    setNuevaFecha(s.fecha);
    setNuevaHora(s.hora);
  };

  const guardarReprogramacion = (folio: string) => {
    if (!nuevaFecha || !nuevaHora) return;
    setServicios(prev => prev.map(s => s.folio === folio ? { ...s, fecha: nuevaFecha, hora: nuevaHora, estatus: 'Reprogramado' } : s));
    push({ kind: 'success', title: 'Servicio reprogramado', msg: `${folio} se movió a ${nuevaFecha} ${nuevaHora}.` });
    setReprogramando(null);
  };

  const crearServicio = (nuevo: Omit<ServicioProgramado, 'folio' | 'estatus'>) => {
    const folio = `SV-${folioSeq++}`;
    setServicios(prev => [{ ...nuevo, folio, estatus: 'Programado' }, ...prev]);
    push({ kind: 'success', title: 'Servicio programado', msg: `${folio} se agregó para ${nuevo.fecha} ${nuevo.hora}.` });
    setMostrarForm(false);
  };

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}>
      {/* Widget de calendario: qué días hay qué */}
      <div style={{ ...cardStyle, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>Calendario de servicios</h3>
          {diaFiltro && (
            <button onClick={() => setDiaFiltro('')} style={{
              fontSize: 12, fontWeight: 600, color: colores.primario, background: 'transparent', border: 'none', cursor: 'pointer',
            }}>
              Quitar filtro de {diaFiltro}
            </button>
          )}
        </div>
        <Calendario marcadores={marcadores} seleccionada={diaFiltro} onSelectDia={setDiaFiltro} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap' }}>
          {TIPOS.map(t => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${filtro === t ? colores.primario : colores.borde}`,
                background: filtro === t ? colores.primario : colores.fondoClaro,
                color: filtro === t ? '#fff' : colores.textoMedio,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setMostrarForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10,
            border: 'none', background: colores.primario, color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Programar servicio
        </button>
      </div>

      <div style={{ ...cardStyle, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${colores.borde}` }}>
          <CalendarClock size={18} color={colores.primario} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>
            {filtrados.length} servicios {diaFiltro ? `el ${diaFiltro}` : filtro !== 'Todos' ? filtro.toLowerCase() + 's' : 'programados'}
          </h3>
        </div>

        {filtrados.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: colores.textoOscuro }}>
            Sin servicios para este filtro.
          </div>
        )}

        <div>
          {filtrados.map(s => (
            <div key={s.folio} style={{ padding: '14px 20px', borderBottom: `1px solid ${colores.borde}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{s.cliente}</div>
                  <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>
                    {s.folio} · {s.tipo} · unidad {s.unidad}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: colores.textoMedio, minWidth: 120 }}>
                  {s.fecha} · {s.hora}
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                  color: '#fff', background: COLOR_ESTATUS[s.estatus], flexShrink: 0,
                }}>
                  {s.estatus}
                </span>
                {s.estatus !== 'Cancelado' && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => abrirReprogramar(s)}
                      title="Reprogramar"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8,
                        border: `1px solid ${colores.borde}`, background: colores.fondoClaro, color: colores.textoMedio,
                        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      <CalendarCog size={14} /> Reprogramar
                    </button>
                    <button
                      onClick={() => cancelar(s.folio, s.cliente)}
                      title="Cancelar"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8,
                        border: `1px solid ${colores.peligro}`, background: colores.fondoClaro, color: colores.peligro,
                        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      <XCircle size={14} /> Cancelar
                    </button>
                  </div>
                )}
              </div>

              {s.notas && (
                <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 8, fontStyle: 'italic' }}>
                  {s.notas}
                </div>
              )}

              {reprogramando === s.folio && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap',
                  padding: 12, borderRadius: 10, background: colores.fondoSecundario,
                }}>
                  <input type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)}
                    style={{ padding: '7px 10px', borderRadius: 8, border: `1px solid ${colores.borde}`, fontSize: 13 }} />
                  <input type="time" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)}
                    style={{ padding: '7px 10px', borderRadius: 8, border: `1px solid ${colores.borde}`, fontSize: 13 }} />
                  <button
                    onClick={() => guardarReprogramacion(s.folio)}
                    style={{
                      padding: '7px 14px', borderRadius: 8, border: 'none', background: colores.primario,
                      color: '#fff', fontWeight: 700, fontSize: 12.5, cursor: 'pointer',
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setReprogramando(null)}
                    style={{
                      padding: '7px 14px', borderRadius: 8, border: `1px solid ${colores.borde}`, background: 'transparent',
                      color: colores.textoMedio, fontSize: 12.5, cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {mostrarForm && (
        <NuevoServicioModal
          onClose={() => setMostrarForm(false)}
          onCrear={crearServicio}
          fechaSugerida={diaFiltro}
        />
      )}
    </div>
  );
};

interface NuevoServicioModalProps {
  onClose: () => void;
  onCrear: (s: Omit<ServicioProgramado, 'folio' | 'estatus'>) => void;
  fechaSugerida?: string;
}

const NuevoServicioModal: React.FC<NuevoServicioModalProps> = ({ onClose, onCrear, fechaSugerida }) => {
  const { colores } = brandingConfig;
  const [cliente, setCliente] = useState(CLIENTES[0].nombre);
  const [tipo, setTipo] = useState<TipoServicio>('Ordinario');
  const [fecha, setFecha] = useState(fechaSugerida || '');
  const [hora, setHora] = useState('09:00');
  const [unidad, setUnidad] = useState(UNIDADES[0].id);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colores.borde}`,
    fontSize: 13.5, color: colores.textoClaro, outline: 'none', background: colores.fondoClaro,
  };
  const labelStyle: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: colores.textoMedio, marginBottom: 6, display: 'block' };

  const submit = () => {
    if (!cliente || !fecha || !hora || !unidad) return;
    onCrear({ cliente, tipo, fecha, hora, unidad });
  };

  return (
    <div
      role="dialog" aria-modal="true"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div style={{ width: 'min(440px, 100%)', background: colores.fondoClaro, borderRadius: 18, boxShadow: colores.sombraGrande, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: `1px solid ${colores.borde}` }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: colores.textoClaro }}>Programar servicio</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: colores.textoOscuro }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Cliente</label>
            <select value={cliente} onChange={e => setCliente(e.target.value)} style={inputStyle}>
              {CLIENTES.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Tipo de servicio</label>
            <select value={tipo} onChange={e => setTipo(e.target.value as TipoServicio)} style={inputStyle}>
              <option value="Ordinario">Ordinario</option>
              <option value="Recurrente">Recurrente</option>
              <option value="Extraordinario">Extraordinario</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Fecha</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Hora</label>
              <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Unidad asignada</label>
            <select value={unidad} onChange={e => setUnidad(e.target.value)} style={inputStyle}>
              {UNIDADES.map(u => <option key={u.id} value={u.id}>{u.id} · {u.tipo}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderTop: `1px solid ${colores.borde}` }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${colores.borde}`,
            background: 'transparent', color: colores.textoMedio, fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
          }}>
            Cancelar
          </button>
          <button onClick={submit} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
            background: colores.primario, color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
          }}>
            Programar
          </button>
        </div>
      </div>
    </div>
  );
};
