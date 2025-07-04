import pg from 'pg';

export const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'contrasena',
  database: 'Sisbdtur',
  port: 5432,
});
