import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  queueLimit: 0,
};

const pool =
  globalThis.__crateIncMysqlPool ?? mysql.createPool(dbConfig);

if (process.env.NODE_ENV !== "production") {
  globalThis.__crateIncMysqlPool = pool;
}

export const db = {
  async execute(sql, values = []) {
    return pool.execute(sql, values);
  },

  async transaction(callback) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();

      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  },
};
