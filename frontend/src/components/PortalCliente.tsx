import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, CalendarClock } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { CLIENTES } from '../data/clientes';
import { SERVICIOS_PROGRAMADOS } from '../data/servicios';
import { EXPEDIENTES } from '../data/custodia';

const REPORTES_DEMO = [
  { nombre: 'Reporte de servicios — septiembre 2026', fecha: '2026-10-01' },
  { nombre: 'Reporte de cumplimiento SLA — Q3 2026', fecha: '2026-10-02' },
  { nombre: 'Reporte de incidencias — septiembre 2026', fecha: '2026-10-01' },
];

type Tab = 'servicios' | 'evidencias' | 'reportes';

export const PortalCliente: React.FC = () => {
  const { colores } = brandingConfig;
  const { push } = useToast();
  const [clienteId, setClienteId] = useState(CLIENTES[0].id);
  const [tab, setTab] = useState<Tab>('servicios');

  const cliente = CLIENTES.find(c => c.id === clienteId) ?? CLIENTES[0];
  const servicios = SERVICIOS_PROGRAMADOS.filter(s => s.cliente.includes(cliente.nombre.split(' ')[0]));
  const evidencias = EXPEDIENTES.filter(e => e.cliente.includes(cliente.nombre.split(' ')[0]));

  const descargar = (nombre: string) => push({ kind: 'success', title: 'Descarga iniciada', msg: `${nombre} (demo, sin archivo real).` });

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: colores.textoOscuro, fontWeight: 600 }}>Vista previa como:</span>
        <select
          value={clienteId}
          onChange={e => setClienteId(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colores.borde}`, fontSize: 13.5, color: colores.textoClaro }}
        >
          {CLIENTES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
      </div>

      {/* Chrome tipo ventana de navegador */}
      <div style={{ ...cardStyle, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: colores.fondoSecundario, borderBottom: `1px solid ${colores.borde}` }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
          </div>
          <div style={{
            flex: 1, background: colores.fondoClaro, borderRadius: 999, padding: '4px 12px',
            fontSize: 12, color: colores.textoOscuro, textAlign: 'center',
          }}>
            portal.bbox.com/cliente/{cliente.id.toLowerCase()}
          </div>
        </div>

        <div style={{ padding: 24 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: colores.textoClaro }}>Hola, {cliente.nombre}</h2>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: colores.textoOscuro }}>Consulta tus servicios, evidencias y reportes.</p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {([['servicios', 'Servicios', CalendarClock], ['evidencias', 'Evidencias', ShieldCheck], ['reportes', 'Reportes', FileText]] as const).map(([id, label, Icono]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999,
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  border: `1px solid ${tab === id ? colores.primario : colores.borde}`,
                  background: tab === id ? colores.primario : colores.fondoClaro,
                  color: tab === id ? '#fff' : colores.textoMedio,
                }}
              >
                <Icono size={14} /> {label}
              </button>
            ))}
          </div>

          {tab === 'servicios' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {servicios.length === 0 && <EmptyState texto="Sin servicios programados por ahora." />}
              {servicios.map(s => (
                <div key={s.folio} style={{ padding: '10px 0', borderBottom: `1px solid ${colores.borde}` }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: colores.textoClaro }}>{s.folio} · {s.tipo}</div>
                  <div style={{ fontSize: 12, color: colores.textoOscuro }}>{s.fecha} · {s.hora} · estatus {s.estatus}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'evidencias' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {evidencias.length === 0 && <EmptyState texto="Sin evidencias registradas por ahora." />}
              {evidencias.map(e => (
                <div key={e.folio} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colores.borde}` }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: colores.textoClaro }}>{e.folio} · {e.estatus}</div>
                    <div style={{ fontSize: 12, color: colores.textoOscuro }}>{e.eventos.length} eventos de cadena de custodia</div>
                  </div>
                  <button onClick={() => descargar(`Evidencia ${e.folio}`)} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
                    border: `1px solid ${colores.borde}`, background: 'transparent', color: colores.textoMedio, fontSize: 12, cursor: 'pointer',
                  }}>
                    <Download size={13} /> Descargar
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === 'reportes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {REPORTES_DEMO.map(r => (
                <div key={r.nombre} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colores.borde}` }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: colores.textoClaro }}>{r.nombre}</div>
                    <div style={{ fontSize: 12, color: colores.textoOscuro }}>Generado {r.fecha}</div>
                  </div>
                  <button onClick={() => descargar(r.nombre)} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
                    border: `1px solid ${colores.borde}`, background: 'transparent', color: colores.textoMedio, fontSize: 12, cursor: 'pointer',
                  }}>
                    <Download size={13} /> Descargar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ texto: string }> = ({ texto }) => {
  const { colores } = brandingConfig;
  return <div style={{ fontSize: 13, color: colores.textoOscuro, padding: '12px 0' }}>{texto}</div>;
};
