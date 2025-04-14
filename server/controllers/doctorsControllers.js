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

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is missing or empty' });
  }
  const {doctor_name = '',email_id = '', password = '', department = '', contact = '', experiance = '', photo = ''
  } = req.body;
  if (!doctor_name || !email_id || !password || !department || !contact) {
    return res.status(400).json({ 
      error: 'Missing required fields (doctor_name, email_id, password, department, contact)' 
    });
  } sql.query(
    `INSERT INTO doctor  (doctor_name, email_id, password, department, contact, experiance, photo) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,[doctor_name, email_id, password, department, contact, experiance, photo],
    (err, result) => {
      if (err) {
        console.error('Add doctor error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.status(201).json({ 
        message: 'Doctor added successfully',
        id: result.insertId 
      });
    }
  );
};

const updateDoctor = (req, res) => {
  const { id } = req.params;
  const doctor = req.body;
  
  if (!doctor || !id) {
    return res.status(400).json({ error: 'Missing doctor data or ID' });
  }
  const { doctor_name = '',  email_id = '',  password = '',  department = '',  contact = '',  experiance = '',  photo = ''  } = doctor;
  sql.query( `UPDATE doctor  SET doctor_name = ?, email_id = ?, password = ?, department = ?, contact = ?, experiance = ?, photo = ?
    WHERE id = ? `,[doctor_name, email_id, password, department, contact, experiance, photo, id],
    (err, result) => {
      if (err) {
        console.log('Update error:', err);
        return res.status(500).json({ error: 'Internal server error' }); 
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      return res.status(200).json({ message: 'Doctor updated successfully' }); 
    }
  );
};

const deleteDoctor = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'missing doctor id' });
  } else {
    sql.query('DELETE FROM doctor WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Delete error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (result.affectedRows === 0) {  
        return res.status(404).json({ error: 'Doctor not found' });
      }
      return res.status(200).json({ message: 'Doctor deleted successfully' });
    });
  }
};






module.exports = { getDoctors, addDoctors ,updateDoctor ,deleteDoctor};
