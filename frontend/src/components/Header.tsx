import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Search,
  CalendarDays,
  CornerDownLeft,
} from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { SECCIONES, buscarSeccion } from '../data/asistente';
import { porPeriodo, ULTIMO, fmtMXNCorto } from '../data/media';
import { BrainCanvas } from './modules/dashboardModules/BrainCanvas';
import { useConfirm } from './shared/confirm';
import { useToast } from './shared/toast';
import { useRole, ROL_LABEL, opcionesAsociado, type Rol } from './shared/role';

interface HeaderProps {
  title: string;
  onSectionChange?: (id: string) => void;
}

interface Notification {
  id: number;
  tipo: 'alerta' | 'exito' | 'info' | 'urgente';
  titulo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  plan?: string;
}

const D = porPeriodo[ULTIMO];
const notificacionesEstaticas: Notification[] = [
  { id: 1, tipo: 'urgente', titulo: 'Nuevo caso en Conciliación',            mensaje: 'Verificación On-Air detectó una discrepancia entre lo reportado por el medio y lo reportado por la agencia. Requiere revisión del comité.', tiempo: 'Hace 3 min',  leida: false, plan: 'Abrir el caso en Conciliación y notificar a ambas partes para que adjunten evidencia.' },
  { id: 2, tipo: 'alerta',  titulo: 'Detección on-air · MVS 102.5',          mensaje: 'Nueva detección en el bloque matutino. Escucha el clip con timestamp en Verificación On-Air.', tiempo: 'Hace 8 min',  leida: false },
  { id: 3, tipo: 'info',    titulo: 'Entrega de HR Media validada',          mensaje: `Inversión de industria de ${fmtMXNCorto(D.inversionTotal)} consolidada para ${ULTIMO}. Disponible en Inversión Publicitaria.`, tiempo: 'Hace 22 min', leida: false },
  { id: 4, tipo: 'exito',   titulo: 'Paquete de auditoría exportado',        mensaje: 'El comité descargó el paquete de trazabilidad del periodo en formato compatible con 3m3a.', tiempo: 'Hace 1 hora', leida: true  },
  { id: 5, tipo: 'info',    titulo: 'Conflicto de homologación pendiente',   mensaje: 'El Catálogo Maestro detectó un anunciante reportado con dos nombres distintos entre proveedores.', tiempo: 'Hace 2 horas', leida: true  },
];

export const Header: React.FC<HeaderProps> = ({ title, onSectionChange }) => {
  const { colores, empresa } = brandingConfig;

  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notification[]>(notificacionesEstaticas);
  const notifRef = useRef<HTMLDivElement>(null);
  const confirmar = useConfirm();
  const { push } = useToast();

  const activarPlanNotif = async (n: Notification) => {
    if (n.plan && await confirmar({ titulo: n.titulo, descripcion: n.plan })) {
      marcarComoLeida(n.id);
      push({ kind: 'success', title: 'Plan activado', msg: n.plan });
    }
  };

  const [query, setQuery] = useState('');
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultados = query.trim() ? buscarSeccion(query) : SECCIONES;

  const irASeccion = (id: string) => {
    onSectionChange?.(id);
    setBuscadorAbierto(false);
    setQuery('');
    inputRef.current?.blur();
  };

  // Mini-jarvis: va a Verificación On-Air (la sección con datos reales) y lo abre.
  const abrirJarvis = () => {
    onSectionChange?.('verificacion');
    setTimeout(() => window.dispatchEvent(new CustomEvent('jarvis:open')), 350);
  };

  const { rol, asociadoId, setRol, setAsociadoId } = useRole();
  const asociadosDelRol = opcionesAsociado(rol);

  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotificacionesAbiertas(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node))
        setBuscadorAbierto(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  const getIconoPorTipo = (tipo: Notification['tipo']) => {
    switch (tipo) {
      case 'alerta':  return <AlertTriangle size={16} color="#F59E0B" />;
      case 'exito':   return <CheckCircle   size={16} color="#10B981" />;
      case 'urgente': return <AlertTriangle size={16} color="#EF4444" />;
      case 'info':    return <Info          size={16} color="#3B82F6" />;
    }
  };

  const marcarComoLeida = (id: number) =>
    setNotificaciones(notificaciones.map(n => n.id === id ? { ...n, leida: true } : n));

  const marcarTodasComoLeidas = () =>
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));

  return (
    <>
      <header
        style={{
          height: '72px',
          backgroundColor: colores.fondoSecundario,
          borderBottom: `1px solid ${colores.borde}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          gap: '8px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 300,
        }}
      >
        {/* ── IZQUIERDA: Buscador de secciones ── */}
        <div
          ref={searchWrapRef}
          style={{ flex: 1, maxWidth: '540px', position: 'relative' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 14px',
              height: '44px',
              borderRadius: buscadorAbierto && resultados.length ? '14px 14px 0 0' : '999px',
              backgroundColor: buscadorAbierto ? colores.fondoPrincipal : colores.fondoTerciario,
              border: `1px solid ${buscadorAbierto ? colores.primario : colores.borde}`,
              transition: 'border-radius 0.15s, background-color 0.2s',
              boxShadow: buscadorAbierto ? `0 0 0 3px ${colores.primario}28` : 'none',
              position: 'relative',
              zIndex: 310,
            }}
          >
            <Search size={17} style={{ color: colores.primario, flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setBuscadorAbierto(true); }}
              onFocus={() => setBuscadorAbierto(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' && resultados[0]) irASeccion(resultados[0].id);
                if (e.key === 'Escape') { setBuscadorAbierto(false); inputRef.current?.blur(); }
              }}
              placeholder="Buscar sección…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontSize: '14px', color: colores.textoClaro,
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                <X size={16} style={{ color: colores.textoMedio }} />
              </button>
            )}
          </div>

          {/* Resultados */}
          {buscadorAbierto && (
            <div
              style={{
                position: 'absolute', top: '43px', left: 0, right: 0,
                backgroundColor: colores.fondoPrincipal,
                border: `1px solid ${colores.primario}`,
                borderTop: `1px solid ${colores.borde}`,
                borderRadius: '0 0 16px 16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                overflow: 'hidden', zIndex: 305,
                maxHeight: 'calc(100vh - 130px)', overflowY: 'auto',
              }}
            >
              {resultados.length === 0 ? (
                <div style={{ padding: '16px', fontSize: '13px', color: colores.textoMedio }}>
                  Sin coincidencias para "{query}"
                </div>
              ) : (
                resultados.map(s => (
                  <button
                    key={s.id}
                    onClick={() => irASeccion(s.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '11px 16px', border: 'none', background: 'transparent',
                      cursor: 'pointer', textAlign: 'left', borderBottom: `1px solid ${colores.borde}`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Search size={15} style={{ color: colores.textoOscuro, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: colores.textoClaro }}>{s.titulo}</span>
                    <CornerDownLeft size={14} style={{ color: colores.textoOscuro }} />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── CENTRO: Logo ── */}
        <div style={{
          backgroundColor: '#FFFFFF', border: `1px solid ${colores.borde}`, borderRadius: '14px',
          padding: '10px 20px', display: 'flex', alignItems: 'center',
          flexShrink: 0, height: '52px', overflow: 'hidden',
        }}>
          <img
            src={empresa.logo}
            alt={`${empresa.nombre} logo`}
            style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* ── DERECHA: Contexto de cliente + Jarvis + Fecha + Bell + Avatar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Selector de rol — televisora / agencia / comité. Cambia lo que se
              muestra en Verificación On-Air, Inversión Publicitaria y Conciliación. */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            padding: '5px 12px', borderRadius: '14px',
            backgroundColor: colores.fondoTerciario, border: `1px solid ${colores.borde}`,
            flexShrink: 0,
          }} title={`Viendo la plataforma como ${ROL_LABEL[rol]}`}>
            <select
              value={rol}
              onChange={e => setRol(e.target.value as Rol)}
              style={{
                border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: '13px', fontWeight: 700, color: colores.textoClaro, appearance: 'none',
              }}
            >
              {(['comite', 'televisora', 'agencia'] as Rol[]).map(r => (
                <option key={r} value={r}>{ROL_LABEL[r]}</option>
              ))}
            </select>
            {asociadosDelRol.length > 0 && (
              <select
                value={asociadoId}
                onChange={e => setAsociadoId(e.target.value)}
                style={{
                  border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer',
                  fontSize: '11px', color: colores.textoOscuro, appearance: 'none',
                }}
              >
                {asociadosDelRol.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            )}
          </div>

          {/* Mini-jarvis (átomo) — acceso rápido al asistente */}
          <button
            onClick={abrirJarvis}
            title="Abrir MAYIA"
            aria-label="Abrir asistente MAYIA"
            style={{
              width: '46px', height: '46px', borderRadius: '50%',
              backgroundColor: colores.fondoTerciario, border: `1px solid ${colores.borde}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0, transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = `0 0 0 3px ${colores.primario}28`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ width: 60, height: 60, pointerEvents: 'none' }}>
              <BrainCanvas accent={colores.primario} height={60} nodes={55} />
            </div>
          </button>

          {/* Fecha pegada a la campana */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '7px 14px', borderRadius: '999px',
            backgroundColor: colores.fondoTerciario,
            border: `1px solid ${colores.borde}`,
            marginRight: '4px',
          }}>
            <CalendarDays size={14} style={{ color: colores.textoMedio }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: colores.textoClaro }}>
              {fechaFormateada}
            </span>
          </div>

          {/* Notificaciones */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setNotificacionesAbiertas(!notificacionesAbiertas)}
              style={iconBtnStyle(colores.fondoTerciario)}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoPrincipal)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
            >
              <Bell size={19} style={{ color: colores.textoClaro }} />
              {notificacionesNoLeidas > 0 && (
                <span style={{
                  position: 'absolute', top: '6px', right: '6px',
                  minWidth: '17px', height: '17px', borderRadius: '10px',
                  backgroundColor: '#EF4444', border: `2px solid ${colores.fondoSecundario}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 'bold', color: '#FFFFFF', padding: '0 3px',
                }}>
                  {notificacionesNoLeidas}
                </span>
              )}
            </button>

            {notificacionesAbiertas && (
              <div style={{
                position: 'absolute', top: '56px', right: '0',
                width: '370px', maxHeight: '480px',
                backgroundColor: colores.fondoSecundario,
                borderRadius: '14px', border: `1px solid ${colores.borde}`,
                boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                overflow: 'hidden', zIndex: 1000,
              }}>
                <div style={{
                  padding: '14px 18px', borderBottom: `1px solid ${colores.borde}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: colores.textoClaro }}>Notificaciones</h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: colores.textoMedio }}>{notificacionesNoLeidas} sin leer</p>
                  </div>
                  {notificacionesNoLeidas > 0 && (
                    <button onClick={marcarTodasComoLeidas}
                      style={{ background: 'none', border: 'none', color: colores.primario, fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      Marcar todas
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  {notificaciones.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => marcarComoLeida(notif.id)}
                      style={{
                        padding: '14px 18px', borderBottom: `1px solid ${colores.borde}`,
                        backgroundColor: notif.leida ? 'transparent' : colores.fondoTerciario + '44',
                        cursor: 'pointer', transition: 'background-color 0.15s', display: 'flex', gap: '10px',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = colores.fondoTerciario)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = notif.leida ? 'transparent' : colores.fondoTerciario + '44')}
                    >
                      <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIconoPorTipo(notif.tipo)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: notif.leida ? '500' : '700', color: colores.textoClaro }}>
                            {notif.titulo}
                          </h4>
                          {!notif.leida && (
                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: colores.primario, flexShrink: 0, marginLeft: '8px', marginTop: '4px' }} />
                          )}
                        </div>
                        <p style={{ margin: '2px 0', fontSize: '12px', color: colores.textoMedio, lineHeight: '1.4' }}>{notif.mensaje}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 4 }}>
                          <span style={{ fontSize: '11px', color: colores.textoOscuro }}>{notif.tiempo}</span>
                          {notif.plan && (
                            <button
                              onClick={e => { e.stopPropagation(); activarPlanNotif(notif); }}
                              style={{ border: 'none', background: colores.primario, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '5px 11px', borderRadius: 8, cursor: 'pointer', flexShrink: 0 }}
                            >
                              Activar plan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '10px 18px', borderTop: `1px solid ${colores.borde}`, textAlign: 'center' }}>
                  <button style={{ background: 'none', border: 'none', color: colores.primario, fontSize: '13px', fontWeight: '600', cursor: 'pointer', width: '100%', padding: '6px' }}>
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <button
            style={{
              width: '52px', height: '52px', borderRadius: '50%',
              backgroundColor: '#FFFFFF', border: `2px solid ${colores.borde}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', overflow: 'hidden', padding: '9px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <img
              src={empresa.logo}
              alt={empresa.nombre}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container) {
                  container.style.background = `linear-gradient(135deg, ${colores.primario}, ${colores.secundario})`;
                  container.style.fontSize = '16px';
                  container.style.fontWeight = 'bold';
                  container.style.color = '#FFFFFF';
                  container.textContent = 'M';
                }
              }}
            />
          </button>
        </div>
      </header>
    </>
  );
};

const iconBtnStyle = (bg: string): React.CSSProperties => ({
  width: '40px', height: '40px', borderRadius: '50%',
  backgroundColor: bg, border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  position: 'relative', transition: 'background-color 0.2s',
});