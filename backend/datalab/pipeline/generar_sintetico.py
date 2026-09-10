#!/usr/bin/env python3
"""
Generador de Inventario Sintético OOH para ACAM.
Produce un dataset representativo de la distribución metropolitana
(Valle de México, Toluca, Querétaro, Morelos, Puebla) con IDs, coordenadas,
direcciones y tarifas 100% sintéticas, sin datos propietarios de ningún operador.
"""

import json
import random
from datetime import datetime, timezone

# Fijamos semilla para reproducibilidad consistente entre ejecuciones
random.seed(42)

# Vías representativas por zona para generar direcciones sintéticas creíbles
VIAS_POR_ZONA = {
    "CDMX": [
        ("Av. Insurgentes Sur", "Benito Juárez", 19.3800, -99.1750, 0.03),
        ("Paseo de la Reforma", "Cuauhtémoc", 19.4280, -99.1680, 0.02),
        ("Anillo Periférico Sur", "Álvaro Obregón", 19.3500, -99.2000, 0.04),
        ("Calzada de Tlalpan", "Coyoacán", 19.3300, -99.1400, 0.03),
        ("Av. Ejército Nacional", "Miguel Hidalgo", 19.4400, -99.1950, 0.02),
        ("Circuito Interior Melchor Ocampo", "Cuauhtémoc", 19.4350, -99.1720, 0.025),
        ("Av. Patriotismo", "Benito Juárez", 19.3950, -99.1820, 0.02),
        ("Av. Revolución", "Benito Juárez", 19.3850, -99.1850, 0.02),
        ("Viaducto Miguel Alemán", "Benito Juárez", 19.4020, -99.1600, 0.03),
        ("Av. Prolongación Paseo de la Reforma", "Cuajimalpa", 19.3650, -99.2600, 0.03),
        ("Calzada Ignacio Zaragoza", "Iztapalapa", 19.4000, -99.0700, 0.03),
        ("Av. Insurgentes Norte", "Gustavo A Madero", 19.4800, -99.1280, 0.03),
        ("Av. Universidad", "Coyoacán", 19.3550, -99.1750, 0.025),
        ("Av. Río Churubusco", "Iztapalapa", 19.3650, -99.1100, 0.03),
        ("Av. Fray Servando Teresa de Mier", "Venustiano Carranza", 19.4230, -99.1180, 0.02),
    ],
    "Estado de México_Valle": [
        ("Periférico Blvd. Manuel Ávila Camacho", "Naucalpan", 19.4850, -99.2350, 0.04),
        ("Av. Gustavo Baz Prada", "Tlalnepantla", 19.5350, -99.2000, 0.03),
        ("Vía Dr. Gustavo Baz", "Naucalpan", 19.4750, -99.2300, 0.03),
        ("Av. Central Carlos Hank González", "Ecatepec", 19.5400, -99.0350, 0.04),
        ("Vía Morelos", "Ecatepec", 19.5550, -99.0400, 0.03),
        ("Autopista México-Pachuca km 14", "Ecatepec", 19.5450, -99.0200, 0.03),
        ("Av. Mario Colín", "Tlalnepantla", 19.5400, -99.1850, 0.02),
        ("Autopista México-Querétaro km 33", "Cuautitlán Izcalli", 19.6500, -99.2050, 0.035),
        ("Blvd. Adolfo López Mateos", "Atizapán", 19.5600, -99.2550, 0.03),
        ("Av. Jesús del Monte", "Huixquilucan", 19.3850, -99.2800, 0.025),
        ("Autopista México-Puebla km 23", "Ixtapaluca", 19.3250, -98.9200, 0.03),
        ("Av. Chimalhuacán", "Nezahualcóyotl", 19.4100, -99.0150, 0.03),
    ],
    "Estado de México_Toluca": [
        ("Av. Paseo Tollocan", "Toluca", 19.2850, -99.6100, 0.04),
        ("Av. Tecnológico", "Metepec", 19.2600, -99.5950, 0.03),
        ("Blvd. Miguel Alemán Aeropuerto", "Toluca", 19.3200, -99.5650, 0.03),
        ("Av. Solidaridad Las Torres", "Metepec", 19.2700, -99.6150, 0.035),
        ("Carretera Toluca-Tenango", "Metepec", 19.2350, -99.6000, 0.03),
        ("Av. Alfredo del Mazo", "Toluca", 19.3100, -99.6350, 0.03),
        ("Carretera Toluca-Naucalpan km 48", "Lerma", 19.2900, -99.5250, 0.03),
        ("Vía Lerma-Toluca", "San Mateo Atenco", 19.2750, -99.5450, 0.025),
        ("Calz. al Pacífico", "Zinacantepec", 19.2700, -99.6900, 0.03),
        ("Carretera Toluca-Almoloya", "Almoloya de Juárez", 19.3300, -99.7400, 0.03),
    ],
    "Querétaro": [
        ("Blvd. Bernardo Quintana", "Queretaro", 20.6050, -100.3850, 0.03),
        ("Av. 5 de Febrero", "Queretaro", 20.6150, -100.4150, 0.03),
        ("Av. Constituyentes Oriente", "Queretaro", 20.5850, -100.3800, 0.025),
        ("Autopista México-Querétaro 57D km 198", "Pedro Ecobedo Queretaro", 20.4900, -100.1800, 0.03),
        ("Paseo Central", "San Juan Del Rio", 20.3950, -99.9950, 0.025),
    ],
    "Morelos": [
        ("Autopista México-Acapulco km 88 (Paso Express)", "Cuernavaca", 18.9250, -99.2150, 0.03),
        ("Av. Plan de Ayala", "Cuernavaca", 18.9200, -99.2100, 0.02),
        ("Carretera Cuernavaca-Cuautla", "Cuautla", 18.8250, -98.9600, 0.03),
        ("Carretera Federal México-Cuernavaca km 52", "Huitzilac", 19.0400, -99.2100, 0.03),
        ("Autopista Cuernavaca-Acapulco km 105", "Xochitepec", 18.7850, -99.2300, 0.025),
    ],
    "Puebla": [
        ("Periférico Ecológico", "Puebla", 19.0150, -98.2450, 0.03),
        ("Vía Atlixcáyotl", "Puebla", 19.0180, -98.2350, 0.025),
        ("Blvd. Héroes del 5 de Mayo", "Puebla", 19.0400, -98.1950, 0.025),
        ("Autopista México-Puebla km 118", "Puebla", 19.0800, -98.2200, 0.03),
        ("Av. 31 Poniente", "Puebla", 19.0350, -98.2200, 0.02),
    ],
}

CRUCES_GENERICOS = [
    "esq. Calle 10", "esq. Av. Central", "casi esq. Av. Morelos",
    "frente a Plaza Comercial", "km 12.5 tramo norte", "esq. Calle Hidalgo",
    "incorporación lateral sur", "pasando distribuidor vial", "frente al parque industrial",
    "esq. Av. Las Rosas", "frente a centro corporativo", "a 200 m del entronque",
    "esq. Calz. de los Fresnos", "tramo elevado", "sentido hacia el centro"
]

TIPOS_PESOS = [
    ("otro", 0.565),
    ("azotea", 0.260),
    ("cartelera", 0.083),
    ("puente", 0.052),
    ("muro", 0.040)
]

DIMENSIONES_ESTANDAR = [
    (12.9, 7.2, 92.88),
    (13.2, 7.2, 95.04),
    (12.9, 10.8, 139.32),
    (10.0, 3.0, 30.0),
    (9.0, 10.0, 90.0),
    (12.9, 3.6, 46.44),
    (12.0, 6.0, 72.0),
    (10.0, 4.0, 40.0),
]

def elegir_por_peso(opciones):
    total = sum(p for _, p in opciones)
    r = random.uniform(0, total)
    acum = 0
    for val, p in opciones:
        acum += p
        if r <= acum:
            return val
    return opciones[-1][0]

def generar_datos_sinteticos(total_registros=698):
    datos = []

    # Cuota por zona para mantener la composición macro del mercado:
    # Estado de México: 513 (Toluca 250, Valle 263)
    # CDMX: 142
    # Querétaro: 23
    # Morelos: 15
    # Puebla: 5
    # Total = 698
    distribucion = [
        ("Estado de México_Valle", "Estado de México", "Estado de México", 263),
        ("Estado de México_Toluca", "Estado de México", "Estado de México", 250),
        ("CDMX", "CDMX", "CDMX", 142),
        ("Querétaro", "Querétaro", "Querétaro", 23),
        ("Morelos", "Morelos", "Morelos", 15),
        ("Puebla", "Puebla", "Puebla", 5),
    ]

    registro_num = 1
    # Dejamos 20 registros como no mapeables (lat=null/0, mapeable=false) para consistencia con demo
    indices_no_mapeables = set(random.sample(range(1, total_registros + 1), 20))

    for clave_zona, estado, ciudad, cantidad in distribucion:
        vias = VIAS_POR_ZONA[clave_zona]
        for _ in range(cantidad):
            via_nombre, mun_sintetico, lat_base, lon_base, dispers = random.choice(vias)
            cruce = random.choice(CRUCES_GENERICOS)
            direccion = f"{via_nombre} {cruce}"

            es_mapeable = (registro_num not in indices_no_mapeables)
            if es_mapeable:
                # Jitter gaussiano dentro del corredor vial
                lat = round(lat_base + random.gauss(0, dispers * 0.4), 6)
                lon = round(lon_base + random.gauss(0, dispers * 0.4), 6)
            else:
                lat = 0.0
                lon = 0.0

            tipo = elegir_por_peso(TIPOS_PESOS)

            # Estructura y digital según tipo
            if tipo == "otro":
                estructura = random.choice(["unipolar", "piso", "otro"])
                es_digital = (random.random() < 0.25)
            elif tipo == "azotea":
                estructura = "azotea"
                es_digital = False
            elif tipo == "cartelera":
                estructura = "cartelera"
                es_digital = False
            elif tipo == "puente":
                estructura = "puente"
                es_digital = False
            elif tipo == "muro":
                estructura = "muro"
                es_digital = False
            else:
                estructura = "unipolar"
                es_digital = False

            base_m, altura_m, mts2 = random.choice(DIMENSIONES_ESTANDAR)
            vista = random.choice(["natural", "cruzada", "natural", "natural", "cruzada"])

            # Tarifas generadas según tipo, formato y ubicación
            if es_digital:
                tarifa_base = random.choice([160000, 185000, 210000, 240000, 280000, 320000, 380000])
            elif tipo == "azotea":
                tarifa_base = random.choice([32000, 38000, 42000, 48000, 54000, 62000])
            elif tipo == "muro":
                tarifa_base = random.choice([28000, 35000, 40000, 45000])
            elif tipo == "puente":
                tarifa_base = random.choice([36000, 44000, 52000, 58000])
            elif estructura == "unipolar":
                tarifa_base = random.choice([45000, 55000, 68000, 85000, 98000, 115000, 135000])
            else:
                tarifa_base = random.choice([30000, 38000, 45000, 52000, 65000])

            # Estado de disponibilidad sintético
            disp_rand = random.random()
            if disp_rand < 0.39: # ~39%
                estado_disp = "inmediata"
                fecha_disp = None
            elif disp_rand < 0.74: # ~35%
                estado_disp = "ocupado"
                fecha_disp = None
            elif disp_rand < 0.85: # ~11%
                estado_disp = "fecha"
                mes = random.choice(["04", "05", "06", "07", "08"])
                dia = random.choice(["01", "15", "30"])
                fecha_disp = f"2026-{mes}-{dia}"
            elif disp_rand < 0.99: # ~14%
                estado_disp = "desconocido"
                fecha_disp = None
            else: # ~1%
                estado_disp = "indefinido"
                fecha_disp = None

            soporte = {
                "id": f"censo_ooh_{registro_num:04d}",
                "id_operador": f"SO-{registro_num:04d}",
                "fuente": "censo_nacional",
                "lat": lat,
                "lon": lon,
                "mapeable": es_mapeable,
                "direccion": direccion,
                "municipio": mun_sintetico,
                "estado": estado,
                "ciudad": ciudad,
                "tipo": tipo,
                "estructura": estructura,
                "vista": vista,
                "base_m": base_m,
                "altura_m": altura_m,
                "mts2": mts2,
                "es_digital": es_digital,
                "tarifa_publicada_mxn": float(tarifa_base),
                "disponibilidad": {
                    "estado": estado_disp,
                    "fecha": fecha_disp
                },
                "audiencia": None,
                "impactos_totales": None,
                "alcance_zona_pct": None
            }

            datos.append(soporte)
            registro_num += 1

    return {
        "meta": {
            "fuente": "censo_sintetico_ooh",
            "version_schema": "1.0",
            "generado": datetime.now(timezone.utc).isoformat(),
            "archivo_origen": "Censo Sintético de Referencia OOH - Industria",
            "total_registros": len(datos)
        },
        "datos": datos
    }

if __name__ == "__main__":
    resultado = generar_datos_sinteticos(698)
    salida_path = "backend/datalab/datos/ooh_inventario.json"
    with open(salida_path, "w", encoding="utf-8") as f:
        json.dump(resultado, f, indent=2, ensure_ascii=False)
    print(f"Generados {len(resultado['datos'])} registros sintéticos en {salida_path}")
