import React, { useState } from 'react';
import { Receipt, Send, FileCheck, Wallet } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { SERVICIOS_FACTURABLES, type ServicioFacturable, type EstatusFactura } from '../data/facturacion';

const COLOR_ESTATUS: Record<EstatusFactura, string> = { Pendiente: '#F59E0B', Facturado: '#3B82F6', 'Enviado a CRM': '#10B981' };
const fmtMXN = (n: number) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });

export const Facturacion: React.FC = () => {
  const { colores } = brandingConfig;
  const { push } = useToast();
  const [servicios, setServicios] = useState<ServicioFacturable[]>(SERVICIOS_FACTURABLES);

  const pendientes = servicios.filter(s => s.estatus === 'Pendiente');
  const totalPendiente = pendientes.reduce((a, s) => a + s.monto, 0);
  const totalFacturado = servicios.filter(s => s.estatus !== 'Pendiente').reduce((a, s) => a + s.monto, 0);

  const generarFactura = (folio: string) => {
    setServicios(prev => prev.map(s => s.folio === folio ? { ...s, estatus: 'Facturado' } : s));
    push({ kind: 'success', title: 'Factura generada', msg: `${folio} se marcó como facturado.` });
  };

  const enviarCRM = (folio: string) => {
    setServicios(prev => prev.map(s => s.folio === folio ? { ...s, estatus: 'Enviado a CRM' } : s));
    push({ kind: 'info', title: 'Enviado a CRM', msg: `${folio} se envió a la plataforma de facturación/CRM.` });
  };

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  const kpis = [
    { icono: Wallet, label: 'Por facturar', valor: fmtMXN(totalPendiente) },
    { icono: Receipt, label: 'Servicios pendientes', valor: pendientes.length.toString() },
    { icono: FileCheck, label: 'Facturado / enviado', valor: fmtMXN(totalFacturado) },
  ];

  return (
    <div style={{ padding: 28, maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...cardStyle, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <k.icono size={18} color={colores.primario} />
              <span style={{ fontSize: 13, color: colores.textoOscuro, fontWeight: 600 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: colores.textoClaro }}>{k.valor}</div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${colores.borde}` }}>
          <Receipt size={18} color={colores.primario} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>Servicios cerrados</h3>
        </div>
        {servicios.map(s => (
          <div key={s.folio} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: `1px solid ${colores.borde}`, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{s.cliente}</div>
              <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>{s.folio} · {s.tipo} · {s.fecha}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro, minWidth: 90 }}>{fmtMXN(s.monto)}</div>
            <span style={{
              fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 999, color: '#fff',
              background: COLOR_ESTATUS[s.estatus],
            }}>
              {s.estatus}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {s.estatus === 'Pendiente' && (
                <button onClick={() => generarFactura(s.folio)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8,
                  border: 'none', background: colores.primario, color: '#fff', fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}>
                  <FileCheck size={14} /> Generar factura
                </button>
              )}
              {s.estatus === 'Facturado' && (
                <button onClick={() => enviarCRM(s.folio)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8,
                  border: `1px solid ${colores.borde}`, background: colores.fondoClaro, color: colores.textoMedio, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}>
                  <Send size={14} /> Enviar a CRM
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
