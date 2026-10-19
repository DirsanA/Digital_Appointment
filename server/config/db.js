const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
<<<<<<< HEAD
  database: "digital_app",
=======
  database: "digital_app"
>>>>>>> c600e3059b5152770ae2b7e060f48a6d601d59ef
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err);
  } else {
    console.log("✅ Connected to the MySQL database.");
  }
});

module.exports = connection;
