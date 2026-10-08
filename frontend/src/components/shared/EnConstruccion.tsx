import React from 'react';
import { brandingConfig } from '../../config/branding';

interface EnConstruccionProps {
  titulo: string;
  descripcion: string;
}

export const EnConstruccion: React.FC<EnConstruccionProps> = ({ titulo, descripcion }) => {
  const { colores } = brandingConfig;

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ maxWidth: '560px', textAlign: 'center' }}>
        <h2 style={{ color: colores.textoClaro, fontSize: '24px', marginBottom: '12px' }}>{titulo}</h2>
        <p style={{ color: colores.textoOscuro, fontSize: '15px', lineHeight: 1.6 }}>{descripcion}</p>
      </div>
    </div>
  );
};
