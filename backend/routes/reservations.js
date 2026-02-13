const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { auth, isOwner } = require('../middleware/auth');

// Rota pública - criar reserva
router.post('/', reservationController.createReservation);

// Rota pública - obter reserva por ID (com validação)
router.get('/:id', reservationController.getReservationById);

// Rotas protegidas (owner ou admin)
router.get('/', auth, isOwner, reservationController.getAllReservations);
router.put('/:id/status', auth, isOwner, reservationController.updateReservationStatus);
router.delete('/:id', auth, isOwner, reservationController.deleteReservation);

module.exports = router;
