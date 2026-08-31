import { Pool, QueryResultRow } from 'pg';

class DatabaseService {
  private static instance: DatabaseService;
  private readonly pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[],
  ): Promise<T[]> {
    const result = await this.pool.query<T>(text, params);
    return result.rows;
  }
}

export const databaseService = DatabaseService.getInstance();
export const query = databaseService.query.bind(databaseService);
export const pool = databaseService.getPool();

/**
 * Ejecuta una función dentro de una transacción usando UNA misma conexión.
 * Si la función lanza un error, se hace ROLLBACK; si no, COMMIT.
 */
export async function withTransaction<T>(
  fn: (q: {
    query<R extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<R[]>;
  }) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const txQuery = async <R extends QueryResultRow = QueryResultRow>(
      text: string,
      params?: unknown[],
    ): Promise<R[]> => {
      const result = await client.query<R>(text, params);
      return result.rows;
    };
    const resultado = await fn({ query: txQuery });
    await client.query('COMMIT');
    return resultado;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}