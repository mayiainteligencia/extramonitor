import React, { useState } from 'react';
import { Route, Truck, Wrench, Gauge, Wand2, Satellite, ChevronDown } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { RUTAS, UNIDADES, type EstatusRuta, type DisponibilidadUnidad, type Ruta } from '../data/rutasFlota';

const COLOR_RUTA: Record<EstatusRuta, string> = { Planeada: '#9CA3AF', 'En curso': '#F59E0B', Completada: '#10B981' };
const COLOR_DISPONIBILIDAD: Record<DisponibilidadUnidad, string> = { Disponible: '#10B981', 'En servicio': '#3B82F6', Mantenimiento: '#EF4444' };

export const RutasFlota: React.FC = () => {
  const { colores } = brandingConfig;
  const { push } = useToast();
  const [tab, setTab] = useState<'rutas' | 'flota'>('rutas');
  const [gpsAbierto, setGpsAbierto] = useState<string | null>(null);

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  const disponibles = UNIDADES.filter(u => u.disponibilidad === 'Disponible').length;
  const enMantenimiento = UNIDADES.filter(u => u.disponibilidad === 'Mantenimiento').length;
  const kmPromedio = Math.round(UNIDADES.reduce((a, u) => a + u.kilometraje, 0) / UNIDADES.length);

  const kpis = [
    { icono: Truck, label: 'Unidades totales', valor: UNIDADES.length.toString() },
    { icono: Gauge, label: 'Disponibles', valor: disponibles.toString() },
    { icono: Wrench, label: 'En mantenimiento', valor: enMantenimiento.toString(), alerta: enMantenimiento > 0 },
    { icono: Route, label: 'Km promedio/unidad', valor: kmPromedio.toLocaleString('es-MX') },
  ];

  return (
    <div style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...cardStyle, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <k.icono size={18} color={k.alerta ? colores.peligro : colores.primario} />
              <span style={{ fontSize: 13, color: colores.textoOscuro, fontWeight: 600 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: k.alerta ? colores.peligro : colores.textoClaro }}>
              {k.valor}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {([['rutas', 'Rutas'], ['flota', 'Flota']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${tab === id ? colores.primario : colores.borde}`,
                background: tab === id ? colores.primario : colores.fondoClaro,
                color: tab === id ? '#fff' : colores.textoMedio,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => push({ kind: 'suggestion', title: 'Optimización de rutas', msg: 'Recálculo de recorridos por zona pendiente de motor de optimización.' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10,
            border: 'none', background: colores.primario, color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
          }}
        >
          <Wand2 size={16} /> Optimizar rutas
        </button>
      </div>

      {tab === 'rutas' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {RUTAS.map(r => (
            <div key={r.id} style={{ ...cardStyle, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: `${colores.primario}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Route size={18} color={colores.primario} />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>{r.zona}</div>
                  <div style={{ fontSize: 12, color: colores.textoOscuro }}>{r.id} · {r.servicios.length} servicios · {r.kmEstimado} km estimados</div>
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                  color: '#fff', background: COLOR_RUTA[r.estatus],
                }}>
                  {r.estatus}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: 12.5, color: colores.textoMedio, marginBottom: 10 }}>
                <span><strong>Unidad:</strong> {r.unidad}</span>
                <span><strong>Conductor:</strong> {r.conductor}</span>
                <span><strong>Custodio:</strong> {r.custodio}</span>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: r.estatus === 'En curso' ? 12 : 0 }}>
                {r.servicios.map(s => (
                  <span key={s} style={{
                    fontSize: 11.5, color: colores.textoOscuro, background: colores.fondoSecundario,
                    padding: '4px 10px', borderRadius: 999,
                  }}>
                    {s}
                  </span>
                ))}
              </div>

              {r.estatus === 'En curso' && (
                <>
                  <button
                    onClick={() => setGpsAbierto(gpsAbierto === r.id ? null : r.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8,
                      border: `1px solid ${colores.borde}`, background: colores.fondoClaro, color: colores.textoMedio,
                      fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <Satellite size={14} /> {gpsAbierto === r.id ? 'Ocultar GPS' : 'Ver GPS en vivo'}
                    <ChevronDown size={14} style={{ transform: gpsAbierto === r.id ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
                  </button>
                  {gpsAbierto === r.id && <GPSMock ruta={r} />}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: `1px solid ${colores.borde}`, fontSize: 11.5, fontWeight: 700, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            <span>Unidad</span><span>Placas</span><span>Tipo</span><span>Kilometraje</span><span>Disponibilidad</span>
          </div>
          {UNIDADES.map(u => (
            <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '0.7fr 1fr 1fr 1fr 1fr', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${colores.borde}`, fontSize: 13.5 }}>
              <span style={{ fontWeight: 700, color: colores.textoClaro }}>{u.id}</span>
              <span style={{ color: colores.textoMedio }}>{u.placas}</span>
              <span style={{ color: colores.textoMedio }}>{u.tipo}</span>
              <span style={{ color: colores.textoMedio }}>
                {u.kilometraje.toLocaleString('es-MX')} km
                <div style={{ fontSize: 11, color: colores.textoOscuro }}>último mant. {u.ultimoMantenimiento}</div>
              </span>
              <span>
                <span style={{
                  fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                  color: '#fff', background: COLOR_DISPONIBILIDAD[u.disponibilidad],
                }}>
                  {u.disponibilidad}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Semilla determinística a partir del id de ruta, para que el mock sea estable entre renders.
const seedDe = (id: string) => id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

/** Mock visual de GPS: sin proveedor real conectado, solo para mostrar cómo se vería el seguimiento. */
const GPSMock: React.FC<{ ruta: Ruta }> = ({ ruta }) => {
  const { colores } = brandingConfig;
  const seed = seedDe(ruta.id);

  // Ruta en zigzag determinística dentro de un viewBox fijo.
  const puntos = [
    [20, 90], [70, 60 + (seed % 20)], [120, 90 - (seed % 15)], [170, 50 + (seed % 25)], [220, 80], [280, 40 + (seed % 10)],
  ];
  const d = puntos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ');
  const avance = 0.55 + (seed % 10) / 40; // posición actual sobre el recorrido, 55%–80%
  const idx = Math.min(puntos.length - 2, Math.floor(avance * (puntos.length - 1)));
  const [x1, y1] = puntos[idx];
  const [x2, y2] = puntos[idx + 1];
  const frac = avance * (puntos.length - 1) - idx;
  const posX = x1 + (x2 - x1) * frac;
  const posY = y1 + (y2 - y1) * frac;

  const lat = (20.6 + (seed % 100) / 1000).toFixed(5);
  const lng = (-103.35 - (seed % 80) / 1000).toFixed(5);
  const velocidad = 25 + (seed % 30);

  return (
    <div style={{ marginTop: 12, padding: 14, borderRadius: 12, background: colores.fondoSecundario }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: colores.textoMedio }}>
          Unidad {ruta.unidad} · {lat}, {lng} · {velocidad} km/h
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: colores.exito }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: colores.exito, animation: 'gpsPulse 1.4s ease-in-out infinite' }} />
          GPS simulado — sin proveedor conectado
        </span>
      </div>
      <svg viewBox="0 0 300 120" width="100%" height={120} style={{ display: 'block' }}>
        <path d={d} fill="none" stroke={colores.borde} strokeWidth={3} strokeLinecap="round" strokeDasharray="6,5" />
        <circle cx={posX} cy={posY} r={9} fill={colores.primario} opacity={0.18}>
          <animate attributeName="r" values="9;15;9" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx={posX} cy={posY} r={5} fill={colores.primario} stroke="#fff" strokeWidth={1.5} />
        <circle cx={puntos[0][0]} cy={puntos[0][1]} r={3.5} fill={colores.textoOscuro} />
        <circle cx={puntos[puntos.length - 1][0]} cy={puntos[puntos.length - 1][1]} r={3.5} fill={colores.textoOscuro} />
      </svg>
      <style>{`@keyframes gpsPulse { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }`}</style>
    </div>
  );
};
