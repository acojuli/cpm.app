# Registro visual: Índice (desktop)

- URL: `/indice`
- Viewport: 1440 px de ancho (página completa)
- Fecha: 2026-11-25

| Antes | Después |
| --- | --- |
| `antes-desktop.png` | `despues-desktop.png` |

## Qué estaba mal

- Composición y Términos quedaban vacíos: el mock devolvía `/funds` sin datos y la página se quedaba en el skeleton.
- Subtítulo enorme (usaba `h2`) y botón "Invertir" descentrado (`ml: 40%`).
- Rendimiento sin selector de período, sin puntos y con las fechas en orden inverso.

## Qué cambió

- Cabecera centrada y proporcionada; botón centrado.
- Composición (íconos + porcentaje) y Términos en dos columnas con filas de la misma altura.
- Rendimiento con tabs 7 días / 1 mes / 1 año / Todo, puntos verdes y fechas cronológicas.
- Mock: `/funds` devuelve la composición y `/perform` respeta el rango pedido.
