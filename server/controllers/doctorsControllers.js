const sql = require('../config/db.js');

const getDoctors = (req, res) => {
  sql.query('SELECT * FROM doctor', (err, result) => {
    if (err) {
      console.error('Select error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(result);
  });
};

const addDoctors = (req, res) => {
    const doctor = req.body[0]; // Assuming you're sending one doctor at a time in an array
    const { doctor_name, email_id, password, department, contact, experiance, photo } = doctor;
    const query = ` INSERT INTO doctor (doctor_name, email_id, password, department, contact, experiance, photo)
        VALUES (?, ?, ?, ?, ?, ?, ?) `;
    sql.query(query, [doctor_name, email_id, password, department, contact, experiance, photo], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(201).json({ message: 'Doctor added successfully', doctorId: result.insertId });
    });
};

module.exports = { getDoctors, addDoctors };
