import React from 'react';
import { UserCog, History, Lock } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { USUARIOS, AUDITORIA, type RolUsuario } from '../data/usuarios';

const COLOR_ROL: Record<RolUsuario, string> = { Operaciones: '#3B82F6', Administración: '#8B5CF6', Supervisión: '#F59E0B' };

export const UsuariosAuditoria: React.FC = () => {
  const { colores } = brandingConfig;

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1300, margin: '0 auto' }}>
      {/* Usuarios */}
      <div style={{ ...cardStyle, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${colores.borde}` }}>
          <UserCog size={18} color={colores.primario} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>Usuarios y permisos</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 0.9fr 0.7fr 1fr', padding: '10px 20px', fontSize: 11.5, fontWeight: 700, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '.04em', borderBottom: `1px solid ${colores.borde}` }}>
          <span>Nombre</span><span>Email</span><span>Rol</span><span>Estatus</span><span>Último acceso</span>
        </div>
        {USUARIOS.map(u => (
          <div key={u.email} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 0.9fr 0.7fr 1fr', alignItems: 'center', padding: '12px 20px', borderBottom: `1px solid ${colores.borde}`, fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: colores.textoClaro }}>{u.nombre}</span>
            <span style={{ color: colores.textoOscuro }}>{u.email}</span>
            <span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', padding: '3px 9px', borderRadius: 999, background: COLOR_ROL[u.rol] }}>
                {u.rol}
              </span>
            </span>
            <span style={{ color: u.activo ? colores.exito : colores.textoOscuro, fontWeight: 600, fontSize: 12.5 }}>
              {u.activo ? 'Activo' : 'Inactivo'}
            </span>
            <span style={{ color: colores.textoOscuro, fontSize: 12.5 }}>{u.ultimoAcceso}</span>
          </div>
        ))}
      </div>

      {/* Auditoría */}
      <div style={{ ...cardStyle, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <History size={18} color={colores.primario} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colores.textoClaro }}>Historial de auditoría</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Lock size={12} color={colores.textoOscuro} />
          <span style={{ fontSize: 11.5, color: colores.textoOscuro }}>Registro no alterable — solo lectura</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {AUDITORIA.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: i < AUDITORIA.length - 1 ? `1px solid ${colores.borde}` : 'none' }}>
              <span style={{ fontSize: 12, color: colores.textoOscuro, minWidth: 130, flexShrink: 0 }}>{e.hora}</span>
              <div>
                <div style={{ fontSize: 13, color: colores.textoClaro }}>
                  <strong>{e.usuario}</strong> · {e.accion}
                </div>
                <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2 }}>{e.detalle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
