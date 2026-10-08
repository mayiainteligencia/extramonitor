import React, { useState } from 'react';
import { Briefcase, Search, Plus, MapPin, User, FileText, ShieldQuestion, X } from 'lucide-react';
import { brandingConfig } from '../config/branding';
import { useToast } from './shared/toast';
import { CLIENTES, type Cliente, type EstatusCliente, type NivelRiesgo } from '../data/clientes';

const COLOR_RIESGO: Record<NivelRiesgo, string> = { Bajo: '#10B981', Medio: '#F59E0B', Alto: '#EF4444' };
const COLOR_ESTATUS: Record<EstatusCliente, string> = { Activo: '#10B981', Prospecto: '#F59E0B', Inactivo: '#9CA3AF' };
let idSeq = CLIENTES.length + 1;

export const Clientes: React.FC = () => {
  const { colores } = brandingConfig;
  const { push } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(CLIENTES[0].id);
  const [mostrarForm, setMostrarForm] = useState(false);

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );
  const cliente = clientes.find(c => c.id === seleccionado) ?? clientes[0];

  const crearCliente = (nuevo: Omit<Cliente, 'id'>) => {
    const id = `CLI-${String(idSeq++).padStart(3, '0')}`;
    const conId: Cliente = { ...nuevo, id };
    setClientes(prev => [conId, ...prev]);
    setSeleccionado(id);
    setMostrarForm(false);
    push({ kind: 'success', title: 'Cliente registrado', msg: `${nuevo.nombre} se dio de alta como ${nuevo.estatus.toLowerCase()}.` });
  };

  const cardStyle: React.CSSProperties = {
    background: colores.fondoClaro, borderRadius: 16, padding: 20,
    border: `1px solid ${colores.borde}`, boxShadow: colores.sombra,
  };

  return (
    <div style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <Search size={16} color={colores.textoOscuro} style={{ position: 'absolute', left: 14, top: 12 }} />
          <input
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar cliente o categoría…"
            style={{
              width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10,
              border: `1px solid ${colores.borde}`, fontSize: 13.5, outline: 'none',
              color: colores.textoClaro, background: colores.fondoClaro,
            }}
          />
        </div>
        <button
          onClick={() => setMostrarForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10,
            border: 'none', background: colores.primario, color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Nuevo cliente
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 0.8fr) minmax(0, 1.4fr)', gap: 16, alignItems: 'start' }}>
        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtrados.map(c => {
            const activo = c.id === seleccionado;
            return (
              <div
                key={c.id}
                onClick={() => setSeleccionado(c.id)}
                style={{
                  ...cardStyle, padding: '14px 16px', cursor: 'pointer',
                  border: `1px solid ${activo ? colores.primario : colores.borde}`,
                  background: activo ? `${colores.primario}0D` : colores.fondoClaro,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{c.nombre}</span>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, color: '#fff', padding: '3px 8px', borderRadius: 999,
                    background: COLOR_ESTATUS[c.estatus], flexShrink: 0,
                  }}>
                    {c.estatus}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: colores.textoOscuro }}>{c.categoria}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLOR_RIESGO[c.riesgo] }} />
                  <span style={{ fontSize: 11.5, color: colores.textoOscuro }}>Riesgo {c.riesgo.toLowerCase()}</span>
                </div>
              </div>
            );
          })}
          {filtrados.length === 0 && (
            <div style={{ ...cardStyle, textAlign: 'center', color: colores.textoOscuro, fontSize: 13 }}>
              Sin resultados para "{busqueda}"
            </div>
          )}
        </div>

        {/* Detalle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: `${colores.primario}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Briefcase size={20} color={colores.primario} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colores.textoClaro }}>{cliente.nombre}</h3>
                <div style={{ fontSize: 12.5, color: colores.textoOscuro }}>{cliente.categoria} · {cliente.id}</div>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <SeccionTitulo icono={ShieldQuestion} titulo="Evaluación de riesgo" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: 12.5, fontWeight: 700, color: '#fff', padding: '5px 12px', borderRadius: 999,
                background: COLOR_RIESGO[cliente.riesgo],
              }}>
                Riesgo {cliente.riesgo}
              </span>
              <span style={{ fontSize: 12.5, color: colores.textoOscuro }}>
                Basado en giro, volumen manejado y antigüedad del contrato.
              </span>
            </div>
          </div>

          <div style={cardStyle}>
            <SeccionTitulo icono={FileText} titulo="Condiciones de servicio" />
            <p style={{ margin: 0, fontSize: 13.5, color: colores.textoMedio, lineHeight: 1.6 }}>
              {cliente.condicionesServicio}
            </p>
          </div>

          <div style={cardStyle}>
            <SeccionTitulo icono={MapPin} titulo={`Sucursales (${cliente.sucursales.length})`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cliente.sucursales.map(s => (
                <div key={s.nombre} style={{ padding: '8px 0', borderBottom: `1px solid ${colores.borde}` }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: colores.textoClaro }}>{s.nombre}</div>
                  <div style={{ fontSize: 12, color: colores.textoOscuro }}>{s.domicilio} · {s.ciudad}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <SeccionTitulo icono={User} titulo={`Contactos (${cliente.contactos.length})`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cliente.contactos.map(c => (
                <div key={c.email} style={{ padding: '8px 0', borderBottom: `1px solid ${colores.borde}` }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: colores.textoClaro }}>{c.nombre} · {c.puesto}</div>
                  <div style={{ fontSize: 12, color: colores.textoOscuro }}>{c.telefono} · {c.email}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {mostrarForm && (
        <NuevoClienteModal onClose={() => setMostrarForm(false)} onCrear={crearCliente} />
      )}
    </div>
  );
};

interface NuevoClienteModalProps {
  onClose: () => void;
  onCrear: (c: Omit<Cliente, 'id'>) => void;
}

const NuevoClienteModal: React.FC<NuevoClienteModalProps> = ({ onClose, onCrear }) => {
  const { colores } = brandingConfig;
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estatus, setEstatus] = useState<EstatusCliente>('Prospecto');
  const [riesgo, setRiesgo] = useState<NivelRiesgo>('Bajo');
  const [condiciones, setCondiciones] = useState('');
  const [sucursalNombre, setSucursalNombre] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [contactoNombre, setContactoNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colores.borde}`,
    fontSize: 13.5, color: colores.textoClaro, outline: 'none', background: colores.fondoClaro,
  };
  const labelStyle: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: colores.textoMedio, marginBottom: 6, display: 'block' };

  const puedeGuardar = nombre.trim() && categoria.trim();

  const submit = () => {
    if (!puedeGuardar) return;
    onCrear({
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      estatus,
      riesgo,
      condicionesServicio: condiciones.trim() || 'Pendiente de definir con el cliente.',
      sucursales: sucursalNombre.trim() ? [{ nombre: sucursalNombre.trim(), domicilio: domicilio.trim(), ciudad: ciudad.trim() }] : [],
      contactos: contactoNombre.trim() ? [{ nombre: contactoNombre.trim(), puesto: puesto.trim(), telefono: telefono.trim(), email: email.trim() }] : [],
    });
  };

  return (
    <div
      role="dialog" aria-modal="true"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}
    >
      <div style={{ width: 'min(520px, 100%)', background: colores.fondoClaro, borderRadius: 18, boxShadow: colores.sombraGrande, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: `1px solid ${colores.borde}`, flexShrink: 0 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: colores.textoClaro }}>Nuevo cliente</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: colores.textoOscuro }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Nombre del cliente *</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Banco Genérico" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Categoría *</label>
              <input value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ej. Banca, Retail…" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Estatus</label>
              <select value={estatus} onChange={e => setEstatus(e.target.value as EstatusCliente)} style={inputStyle}>
                <option value="Prospecto">Prospecto</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Evaluación de riesgo</label>
              <select value={riesgo} onChange={e => setRiesgo(e.target.value as NivelRiesgo)} style={inputStyle}>
                <option value="Bajo">Bajo</option>
                <option value="Medio">Medio</option>
                <option value="Alto">Alto</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Condiciones de servicio</label>
            <textarea value={condiciones} onChange={e => setCondiciones(e.target.value)} rows={2}
              placeholder="Horarios de recolección, pólizas, requisitos de custodia…"
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: 12 }}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>Primera sucursal</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <input value={sucursalNombre} onChange={e => setSucursalNombre(e.target.value)} placeholder="Nombre de sucursal" style={inputStyle} />
              <input value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Ciudad" style={inputStyle} />
            </div>
            <input value={domicilio} onChange={e => setDomicilio(e.target.value)} placeholder="Domicilio" style={inputStyle} />
          </div>

          <div style={{ borderTop: `1px solid ${colores.borde}`, paddingTop: 12 }}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>Contacto principal</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <input value={contactoNombre} onChange={e => setContactoNombre(e.target.value)} placeholder="Nombre" style={inputStyle} />
              <input value={puesto} onChange={e => setPuesto(e.target.value)} placeholder="Puesto" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" style={inputStyle} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderTop: `1px solid ${colores.borde}`, flexShrink: 0 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, border: `1px solid ${colores.borde}`,
            background: 'transparent', color: colores.textoMedio, fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
          }}>
            Cancelar
          </button>
          <button onClick={submit} disabled={!puedeGuardar} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
            background: puedeGuardar ? colores.primario : colores.borde, color: '#fff', fontWeight: 700, fontSize: 13.5,
            cursor: puedeGuardar ? 'pointer' : 'not-allowed',
          }}>
            Registrar cliente
          </button>
        </div>
      </div>
    </div>
  );
};

const SeccionTitulo: React.FC<{ icono: React.ElementType; titulo: string }> = ({ icono: Icono, titulo }) => {
  const { colores } = brandingConfig;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <Icono size={16} color={colores.primario} />
      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>{titulo}</h4>
    </div>
  );
};
