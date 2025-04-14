
const express = require('express');
const router = express.Router();
const doctorsController = require('../controllers/doctorsControllers');


router.get('/', doctorsController.getDoctors);
router.post('/', doctorsController.addDoctors);

module.exports = router;
