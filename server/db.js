const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1227",
  database: "digital_app",
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});
module.exports = connection;
