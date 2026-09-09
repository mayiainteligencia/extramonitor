export const brandingConfig = {
  empresa: {
    nombre: "ACAM",
    eslogan: "Alianza para la Calidad de la Medición Multimedia en México",
    logo: "/assets/logosNativos/LOGO-ACAM.png",
  },

  // Paleta institucional neutral: azul, negro y blanco. Nada de rojo de agencia —
  // ACAM es un JIC con 3 televisoras y 6 agencias como asociados, ninguna manda color.
  colores: {
    primario: "#1E3A8A",           // azul institucional — elemento primario activo
    primarioOscuro: "#0F1E4D",     // azul casi negro — hover
    primarioClaro: "#FFFFFF",      // blanco — superficies claras

    secundario: "#0A0A0A",
    acento: "#1E3A8A",
    acentoOscuro: "#A0AEC0",

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
    textoEnOscuro: "#FFFFFF",      // blanco — texto sobre fondos oscuros (sidebar activo)

    borde: "#CCCCCC",
    bordeHover: "#888888",

    gradientePrimario: "linear-gradient(135deg, #0A0A0A 0%, #1E3A8A 100%)",
    gradienteSecundario: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
    gradienteAcento: "linear-gradient(135deg, #E8E8E8 0%, #FFFFFF 100%)",

    fondoGlass: "#0F1E4D",

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