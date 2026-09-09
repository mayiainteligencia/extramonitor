// Selector de rol mock (sin backend de auth). ACAM existe porque televisoras
// y agencias no confían en los números del otro — este contexto es lo que
// hace que Verificación On-Air, Inversión Publicitaria y Conciliación cambien
// lo que muestran según quién mira.
import React, { createContext, useContext, useState } from 'react';
import { TELEVISORAS, AGENCIAS, ASOCIADO_NOMBRE } from '../../data/media';

export type Rol = 'televisora' | 'agencia' | 'comite';

interface RoleState {
  rol: Rol;
  asociadoId: string;
  setRol: (r: Rol) => void;
  setAsociadoId: (id: string) => void;
}

const RoleContext = createContext<RoleState | null>(null);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rol, setRol] = useState<Rol>('comite');
  const [asociadoId, setAsociadoId] = useState<string>(TELEVISORAS[0].id);

  const handleSetRol = (r: Rol) => {
    setRol(r);
    if (r === 'televisora') setAsociadoId(TELEVISORAS[0].id);
    if (r === 'agencia') setAsociadoId(AGENCIAS[0].id);
  };

  return (
    <RoleContext.Provider value={{ rol, asociadoId, setRol: handleSetRol, setAsociadoId }}>
      {children}
    </RoleContext.Provider>
  );
};

export function useRole(): RoleState {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole debe usarse dentro de RoleProvider');
  return ctx;
}

export const ROL_LABEL: Record<Rol, string> = {
  televisora: 'Televisora',
  agencia: 'Agencia',
  comite: 'Comité ACAM',
};

export const opcionesAsociado = (rol: Rol) =>
  (rol === 'televisora' ? TELEVISORAS : rol === 'agencia' ? AGENCIAS : []).map(a => ({ id: a.id, nombre: ASOCIADO_NOMBRE[a.id] }));
