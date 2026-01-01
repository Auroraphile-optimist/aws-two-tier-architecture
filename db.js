const mysql = require('mysql2/promise');

// Environment variables should be set in .env
// DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

let pool;

// Try to create pool if config exists
if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log("Database configuration detected.");
} else {
  console.warn("No database configuration found. Using mock data.");
}

// Mock Data Store
const mockEntries = [
  { id: 1, content: "The city sleeps, but the lights never do.", created_at: new Date().toISOString() },
  { id: 2, content: "Silence is a rare currency here.", created_at: new Date(Date.now() - 86400000).toISOString() }
];

module.exports = {
  query: async (sql, params) => {
    if (pool) {
      try {
        const [rows, fields] = await pool.execute(sql, params);
        return { rows: rows }; // Standardize output to match PG-style logic if needed, or just return rows
      } catch (err) {
        console.error("Database Error:", err);
        throw err;
      }
    } else {
      // MOCK FALLBACK
      console.log("Mock Query:", sql, params);

      // Simulate async delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (sql.includes('SELECT')) {
        return { rows: mockEntries };
      }

      if (sql.includes('INSERT')) {
        const newEntry = {
          id: mockEntries.length + 1,
          content: params[0],
          created_at: new Date().toISOString()
        };
        mockEntries.unshift(newEntry);
        return { rows: [newEntry] };
      }

      return { rows: [] };
    }
  }
};
