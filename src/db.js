import pg from 'pg';

export const pool = new pg.Pool({
  user: 'angela',
  host: 'localhost',
  password: 'eric758999',
  database: 'Sisbdtur',
  port: 5432,
});
