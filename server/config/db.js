const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "digital_app"
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err);
  } else {
    console.log("✅ Connected to the MySQL database.");
  }
});

module.exports = connection;
