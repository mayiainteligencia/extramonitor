import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { brandingConfig } from '../../config/branding';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const toISO = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

interface CalendarioProps {
  /** Conteo de eventos por fecha ISO (YYYY-MM-DD), para mostrar el puntito/badge del día. */
  marcadores?: Record<string, number>;
  /** Fecha ISO seleccionada, si aplica. */
  seleccionada?: string;
  onSelectDia?: (fechaISO: string) => void;
  /** Mes inicial a mostrar (ISO), por defecto el mes de hoy. */
  mesInicial?: string;
}

export const Calendario: React.FC<CalendarioProps> = ({ marcadores = {}, seleccionada, onSelectDia, mesInicial }) => {
  const { colores } = brandingConfig;
  const base = mesInicial ? new Date(mesInicial) : new Date();
  const [cursor, setCursor] = useState(new Date(base.getFullYear(), base.getMonth(), 1));
  const hoyISO = toISO(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const año = cursor.getFullYear();
  const mes = cursor.getMonth();
  const primerDiaSemana = (new Date(año, mes, 1).getDay() + 6) % 7; // lunes = 0
  const diasEnMes = new Date(año, mes + 1, 0).getDate();

  const celdas: (number | null)[] = [
    ...Array(primerDiaSemana).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={() => setCursor(new Date(año, mes - 1, 1))} style={navBtnStyle(colores.borde)}>
          <ChevronLeft size={16} color={colores.textoMedio} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro, textTransform: 'capitalize' }}>
          {MESES[mes]} {año}
        </span>
        <button onClick={() => setCursor(new Date(año, mes + 1, 1))} style={navBtnStyle(colores.borde)}>
          <ChevronRight size={16} color={colores.textoMedio} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DIAS.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: colores.textoOscuro, padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {celdas.map((d, i) => {
          if (d === null) return <div key={i} />;
          const fechaISO = toISO(año, mes, d);
          const total = marcadores[fechaISO] ?? 0;
          const esHoy = fechaISO === hoyISO;
          const esSeleccionado = fechaISO === seleccionada;
          return (
            <button
              key={i}
              onClick={() => onSelectDia?.(esSeleccionado ? '' : fechaISO)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 2, height: 44, borderRadius: 10, cursor: onSelectDia ? 'pointer' : 'default',
                border: esHoy ? `1px solid ${colores.primario}` : '1px solid transparent',
                background: esSeleccionado ? colores.primario : 'transparent',
              }}
            >
              <span style={{
                fontSize: 12.5, fontWeight: esHoy ? 800 : 500,
                color: esSeleccionado ? '#fff' : colores.textoClaro,
              }}>
                {d}
              </span>
              {total > 0 && (
                <span style={{
                  fontSize: 9.5, fontWeight: 700, lineHeight: 1, padding: '1px 5px', borderRadius: 999,
                  color: esSeleccionado ? colores.primario : '#fff',
                  background: esSeleccionado ? '#fff' : colores.primario,
                }}>
                  {total}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const navBtnStyle = (borde: string): React.CSSProperties => ({
  width: 28, height: 28, borderRadius: 8, border: `1px solid ${borde}`,
  background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
});
