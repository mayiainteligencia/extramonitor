export const brandingConfig = {
  empresa: {
    nombre: "BBOX Security",
    eslogan: "",
    logo: "/assets/logosNativos/bbox.png",
  },

  colores: {
    primario: "#0B5FA8",           // azul corporativo — elemento primario activo (sidebar activo)
    primarioOscuro: "#0A3D73",     // azul oscuro — hover
    primarioClaro: "#FFFFFF",      // Blanco — superficies claras

    secundario: "#0A2A4A",
    acento: "#0A2A4A",
    acentoOscuro: "#7FA8D9",

    peligro: "#EF4444",
    advertencia: "#F59E0B",
    exito: "#10B981",

    fondoPrincipal: "#FFFFFF",
    fondoSecundario: "#FFFFFF",
    fondoTerciario: "#FFFFFF",
    fondoClaro: "#FFFFFF",

    textoClaro: "#0A0A0A",
    textoMedio: "#2D2D2D",
    textoOscuro: "#6B7280",
    textoEnOscuro: "#FFFFFF",      // Blanco — texto sobre fondos azul oscuro (sidebar activo)

    borde: "#CCCCCC",
    bordeHover: "#888888",

    gradientePrimario: "linear-gradient(135deg, #0A2A4A 0%, #123B63 100%)",
    gradienteSecundario: "linear-gradient(135deg, #07213B 0%, #0A2A4A 100%)",
    gradienteAcento: "linear-gradient(135deg, #E8F0FA 0%, #FFFFFF 100%)",

    fondoGlass: "#0A2A4A",

    sombra: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)",
    sombraMedia: "0 4px 12px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06)",
    sombraGrande: "0 10px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.06)",
  },

  metricas: {
    empleados: 568,
    departamentos: 9,
    tareasCompletadas: 13,
    progreso: 70,
  },

  ia: {
    nombre: "MAYIA",
    modelo: "Gemini 2.5 Flash",
    habilitado: true,
  }
};

export type BrandingConfig = typeof brandingConfig;