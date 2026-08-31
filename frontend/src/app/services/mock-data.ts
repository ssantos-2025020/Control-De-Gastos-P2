/* =============================================================================
   LEGATUS — Constantes de UI (NO contiene datos mock de movimientos).
   En esta versión del destino los movimientos (gastos/ingresos) provienen
   SOLO de la base de datos real. Aquí viven únicamente:
   - PRESUPUESTOS_BASE / PRESUPUESTO_TOTAL_BASE: espejo de los límites
     mensuales sembrados en la tabla `presupuestos` (backend).
   - CATEGORIAS_INGRESO: paleta visual de la vista de Ingresos.
   ============================================================================= */

/* ─── Presupuesto mensual por categoría (USD) — espejo del seed del backend ─── */
export const PRESUPUESTOS_BASE: { [key: string]: number } = {
  Alimentacion: 800,
  Transporte: 300,
  Vivienda: 1200,
  'Servicios Publicos': 250,
  Comunicaciones: 150,
  Salud: 350,
  Educacion: 400,
  Entretenimiento: 250,
  'Ropa y Calzado': 200,
  Compras: 300,
  Viajes: 500,
  Mascotas: 120,
  Seguros: 250,
  Impuestos: 500,
  'Ahorro e Inversion': 600,
  Otros: 200,
};

export const PRESUPUESTO_TOTAL_BASE = Object.values(PRESUPUESTOS_BASE).reduce((s, v) => s + v, 0);

/* ─── Categorías de ingreso (paleta de la vista de Ingresos) ─── */
export const CATEGORIAS_INGRESO: { nombre: string; color: string; icono: string }[] = [
  { nombre: 'Sueldo',       color: '#00e7a8', icono: 'wallet' },
  { nombre: 'Bonificación', color: '#a855f7', icono: 'gift' },
  { nombre: 'Ventas',       color: '#f97316', icono: 'shopping-bag' },
  { nombre: 'Servicios',    color: '#0ea5e9', icono: 'wrench' },
  { nombre: 'Otros',        color: '#ec4899', icono: 'banknote' },
];

export type IngresoCategoria = (typeof CATEGORIAS_INGRESO)[number]['nombre'];