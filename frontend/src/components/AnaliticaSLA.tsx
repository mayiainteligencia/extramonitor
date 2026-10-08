import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import { Gauge, TrendingUp, Award, AlertOctagon } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { SLA_POR_CLIENTE, RENTABILIDAD, type DimensionRentabilidad } from '../data/analitica';

const DIMENSIONES: DimensionRentabilidad[] = ['Cliente', 'Ruta', 'Unidad', 'Tipo de servicio'];

const fmtMXNCorto = (n: number) => `$${(n / 1000).toFixed(0)}K`;

export const AnaliticaSLA: React.FC = () => {
  const { colores } = brandingConfig;
  const [dimension, setDimension] = useState<DimensionRentabilidad>('Cliente');

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16, padding: 24,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  const slaPromedio = SLA_POR_CLIENTE.reduce((a, c) => a + c.cumplimiento, 0) / SLA_POR_CLIENTE.length;
  const mejor = SLA_POR_CLIENTE.reduce((a, b) => a.cumplimiento > b.cumplimiento ? a : b);
  const peor = SLA_POR_CLIENTE.reduce((a, b) => a.cumplimiento < b.cumplimiento ? a : b);

  const datosRentabilidad = RENTABILIDAD[dimension].map(r => ({
    ...r,
    margenPct: Math.round((1 - r.costo / r.ingreso) * 100),
  }));

  const kpis = [
    { icono: Gauge, label: 'SLA promedio', valor: `${slaPromedio.toFixed(1)}%` },
    { icono: Award, label: 'Mejor cumplimiento', valor: mejor.cliente, sub: `${mejor.cumplimiento}%` },
    { icono: AlertOctagon, label: 'Menor cumplimiento', valor: peor.cliente, sub: `${peor.cumplimiento}%`, alerta: true },
    { icono: TrendingUp, label: 'Margen promedio', valor: `${Math.round(datosRentabilidad.reduce((a, d) => a + d.margenPct, 0) / datosRentabilidad.length)}%` },
  ];

  return (
    <div style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ ...cardStyle, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <k.icono size={18} color={k.alerta ? colores.peligro : colores.primario} />
              <span style={{ fontSize: 13, color: colores.textoOscuro, fontWeight: 600 }}>{k.label}</span>
            </div>
            <div style={{ fontSize: k.sub ? 16 : 28, fontWeight: 800, color: k.alerta ? colores.peligro : colores.textoClaro, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {k.valor}
            </div>
            {k.sub && <div style={{ fontSize: 20, fontWeight: 800, color: k.alerta ? colores.peligro : colores.textoClaro, marginTop: 2 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* SLA por cliente */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: colores.textoClaro }}>
          Cumplimiento de SLA por cliente
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={SLA_POR_CLIENTE} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke={colores.borde} />
            <XAxis dataKey="cliente" stroke={colores.textoOscuro} fontSize={11} interval={0} angle={-12} textAnchor="end" height={60} />
            <YAxis domain={[80, 100]} stroke={colores.textoOscuro} fontSize={12} unit="%" width={44} />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Cumplimiento']} />
            <Bar dataKey="cumplimiento" radius={[6, 6, 0, 0]}>
              {SLA_POR_CLIENTE.map(c => (
                <Cell key={c.cliente} fill={c.cumplimiento >= 95 ? '#10B981' : c.cumplimiento >= 90 ? '#F59E0B' : '#EF4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rentabilidad por dimensión */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colores.textoClaro }}>
            Rentabilidad por {dimension.toLowerCase()}
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {DIMENSIONES.map(d => (
              <button
                key={d}
                onClick={() => setDimension(d)}
                style={{
                  padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  border: `1px solid ${dimension === d ? colores.primario : colores.borde}`,
                  background: dimension === d ? colores.primario : colores.fondoClaro,
                  color: dimension === d ? '#fff' : colores.textoMedio,
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={datosRentabilidad} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke={colores.borde} />
            <XAxis dataKey="nombre" stroke={colores.textoOscuro} fontSize={11} interval={0} angle={-12} textAnchor="end" height={60} />
            <YAxis stroke={colores.textoOscuro} fontSize={12} tickFormatter={fmtMXNCorto} width={48} />
            <Tooltip formatter={(v: number, n: string) => [fmtMXNCorto(v), n === 'ingreso' ? 'Ingreso' : 'Costo']} />
            <Bar dataKey="ingreso" fill={colores.primario} radius={[6, 6, 0, 0]} />
            <Bar dataKey="costo" fill={colores.textoOscuro} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 10 }}>
          {datosRentabilidad.map(d => (
            <span key={d.nombre} style={{ fontSize: 12, color: colores.textoOscuro }}>
              <strong style={{ color: colores.textoClaro }}>{d.nombre}:</strong> margen {d.margenPct}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
