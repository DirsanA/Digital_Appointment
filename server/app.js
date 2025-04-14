const express = require("express");
const db = require("./db");
const app = express();
const cors = require("cors");
// Middleware
app.use(express.json());
app.use(cors());

// registering pateint

app.post("/users/patient-register", function (req, res) {
  const { name, email, phone, password } = req.body;

  const query = `INSERT INTO patient (full_name, email, phone, password) VALUES (?, ?, ?, ?)`;
  db.query(query, [name, email, phone, password], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error registering patient" });
    } else {
      return res
        .status(201)
        .json({ message: "Patient registered successfully" });
    }
  });
});
module.exports = app;
