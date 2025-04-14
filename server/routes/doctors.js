const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsControllers');

router.get('/', doctorsController.getDoctors);
router.post('/', doctorsController.addDoctors);
router.put('/:id', doctorsController.updateDoctor);
router.delete('/:id', doctorsController.deleteDoctor); // Add this line

module.exports = router;