const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { auth, isOwner } = require('../middleware/auth');

// Rotas públicas
router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

// Rotas protegidas (owner ou admin)
router.post('/', auth, isOwner, restaurantController.createRestaurant);
router.get('/owner/my-restaurants', auth, isOwner, restaurantController.getOwnerRestaurants);
router.put('/:id', auth, isOwner, restaurantController.updateRestaurant);
router.delete('/:id', auth, isOwner, restaurantController.deleteRestaurant);

module.exports = router;
