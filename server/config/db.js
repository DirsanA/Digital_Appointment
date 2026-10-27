const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.DATABASE_URL.includes("localhost") ||
          process.env.DATABASE_URL.includes("127.0.0.1")
            ? false
            : { rejectUnauthorized: false },
      }
    : {
        host: process.env.PG_HOST || "localhost",
        port: parseInt(process.env.PG_PORT, 10) || 5432,
        user: process.env.PG_USER || "postgres",
        password: process.env.PG_PASSWORD || "dbu1401145",
        database: process.env.PG_DATABASE || "digital_app",
      }
);

// Test connection and auto-initialize tables from schema.sql
pool.connect(async (err, client, release) => {
  if (err) {
    console.error("❌ Error connecting to PostgreSQL database:", err.message);
    return;
  }
  console.log(`✅ Connected to PostgreSQL database: "${process.env.PG_DATABASE || "digital_app"}"`);

  try {
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, "utf8");
      await client.query(schemaSql);
      console.log("✅ All tables and schema initialized successfully.");
    }
  } catch (schemaErr) {
    console.error("❌ Error running schema.sql:", schemaErr.message);
  } finally {
    release();
  }
});

module.exports = pool;
