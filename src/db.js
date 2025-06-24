import pg from 'pg';

export const pool = new pg.Pool({
    user: "angela",
    host: "localhost",
    password: "Amvar1234r",
    database: "Sisbdtur",
    port: 5432,
})


