const Restaurant = require('../models/Restaurant');

// Criar restaurante
exports.createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, email, capacity, opening_hours, reservation_duration, google_calendar_id } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ message: 'Nome e capacidade são obrigatórios' });
    }

    const restaurant = await Restaurant.create({
      owner_id: req.userId,
      name,
      description,
      address,
      phone,
      email,
      capacity,
      opening_hours,
      reservation_duration,
      google_calendar_id
    });

    res.status(201).json({
      message: 'Restaurante criado com sucesso',
      restaurant
    });
  } catch (error) {
    console.error('Erro ao criar restaurante:', error);
    res.status(500).json({ message: 'Erro ao criar restaurante', error: error.message });
  }
};

// Listar todos os restaurantes ativos
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAllActive();
    res.json(restaurants);
  } catch (error) {
    console.error('Erro ao listar restaurantes:', error);
    res.status(500).json({ message: 'Erro ao listar restaurantes', error: error.message });
  }
};

// Listar restaurantes do dono autenticado
exports.getOwnerRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findByOwnerId(req.userId);
    res.json(restaurants);
  } catch (error) {
    console.error('Erro ao listar restaurantes:', error);
    res.status(500).json({ message: 'Erro ao listar restaurantes', error: error.message });
  }
};

// Obter restaurante por ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Erro ao obter restaurante:', error);
    res.status(500).json({ message: 'Erro ao obter restaurante', error: error.message });
  }
};

// Atualizar restaurante
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }

    // Verificar se o usuário é o dono
    if (restaurant.owner_id !== req.userId) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este restaurante' });
    }

    const updatedRestaurant = await Restaurant.update(req.params.id, req.body);

    res.json({
      message: 'Restaurante atualizado com sucesso',
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.error('Erro ao atualizar restaurante:', error);
    res.status(500).json({ message: 'Erro ao atualizar restaurante', error: error.message });
  }
};

// Deletar restaurante
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }

    // Verificar se o usuário é o dono
    if (restaurant.owner_id !== req.userId) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este restaurante' });
    }

    await Restaurant.update(req.params.id, { active: false });

    res.json({ message: 'Restaurante desativado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar restaurante:', error);
    res.status(500).json({ message: 'Erro ao deletar restaurante', error: error.message });
  }
};
