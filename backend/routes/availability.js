const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

// Rota pública - obter disponibilidade
router.get('/', availabilityController.getAvailability);

// Rota pública - verificar disponibilidade de horário específico
router.post('/check', availabilityController.checkSlotAvailability);

module.exports = router;
