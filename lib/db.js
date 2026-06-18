import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const db = {
  async execute(sql, values = []) {
    const connection = await mysql.createConnection(dbConfig);

    try {
      return await connection.execute(sql, values);
    } finally {
      await connection.end();
    }
  },

  async transaction(callback) {
    const connection = await mysql.createConnection(dbConfig);

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
