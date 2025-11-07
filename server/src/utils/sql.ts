// SQL utility functions to convert PostgreSQL parameterized queries to SQLite

export function convertQuery(query: string): string {
  // Replace PostgreSQL $1, $2, $3... with SQLite ?
  return query.replace(/\$\d+/g, '?');
}

export async function dbQuery(query: string, pool: any, params?: any[]) {
  const convertedQuery = convertQuery(query);
  return pool.query(convertedQuery, params);
}

