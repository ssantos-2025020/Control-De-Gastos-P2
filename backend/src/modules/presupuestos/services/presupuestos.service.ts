import { query } from '../../../shared/database/database.service';

export class PresupuestoNotFoundError extends Error {
  constructor() {
    super('Presupuesto no encontrado.');
    this.name = 'PresupuestoNotFoundError';
  }
}

interface PresupuestoRow {
  id: string;
  categoriaId: string;
  nombre: string;
  monto: string | number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Presupuesto {
  id: string;
  categoriaId: string;
  nombre: string;
  monto: number;
  createdAt: string;
  updatedAt: string;
}

function aIso(valor: Date | string | undefined | null): string {
  if (valor instanceof Date) {
    return valor.toISOString();
  }
  return String(valor ?? '');
}

function aPresupuesto(fila: PresupuestoRow): Presupuesto {
  return {
    id: fila.id,
    categoriaId: fila.categoriaId,
    nombre: fila.nombre,
    monto: Number(fila.monto),
    createdAt: aIso(fila.createdAt),
    updatedAt: aIso(fila.updatedAt),
  };
}

const SELECT_BASE = `
  SELECT p.id, p."categoriaId", c.nombre, p.monto, p."createdAt", p."updatedAt"
  FROM presupuestos p
  JOIN categorias c ON c.id = p."categoriaId"
`;

class PresupuestosService {
  public async getPresupuestos(): Promise<Presupuesto[]> {
    const filas = await query<PresupuestoRow>(`${SELECT_BASE} ORDER BY c.nombre ASC`);
    return filas.map(aPresupuesto);
  }

  public async getPresupuestoById(id: string): Promise<Presupuesto | null> {
    const filas = await query<PresupuestoRow>(`${SELECT_BASE} WHERE p.id = $1`, [id]);
    return filas[0] ? aPresupuesto(filas[0]) : null;
  }

  public async getPresupuestoByCategory(categoriaId: string): Promise<Presupuesto | null> {
    const filas = await query<PresupuestoRow>(`${SELECT_BASE} WHERE p."categoriaId" = $1`, [
      categoriaId,
    ]);
    return filas[0] ? aPresupuesto(filas[0]) : null;
  }

  public async updateMonto(id: string, monto: number): Promise<Presupuesto> {
    if (isNaN(monto) || monto < 0) {
      throw new Error('El monto debe ser un número mayor o igual a cero.');
    }

    const filas = await query<PresupuestoRow>(
      `UPDATE presupuestos SET monto = $2, "updatedAt" = now() WHERE id = $1
       RETURNING id, "categoriaId", monto, "createdAt", "updatedAt"`,
      [id, monto],
    );

    if (!filas[0]) {
      throw new PresupuestoNotFoundError();
    }

    const completa = await query<PresupuestoRow>(`${SELECT_BASE} WHERE p.id = $1`, [id]);
    return aPresupuesto(completa[0]);
  }
}

export const presupuestosService = new PresupuestosService();