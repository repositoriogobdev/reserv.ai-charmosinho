const axios = require('axios');
const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// Função para enviar webhook n8n
const sendWebhook = async (webhookUrl, data) => {
  try {
    console.log(`📤 Enviando webhook para: ${webhookUrl}`);
    const response = await axios.post(webhookUrl, data, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    console.log(`✅ Webhook enviado com sucesso:`, response.status);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao enviar webhook:`, error.message);
    // Não falhar a reserva se o webhook falhar
    return false;
  }
};

// Criar reserva
exports.createReservation = async (req, res) => {
  try {
    const { restaurant_id, customer_name, customer_email, customer_phone, date, time, number_of_people, notes } = req.body;

    // Validar campos obrigatórios
    if (!restaurant_id || !customer_name || !customer_email || !customer_phone || !date || !time || !number_of_people) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    // Verificar se restaurante existe
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }

    // Criar reserva
    const reservation = await Reservation.create({
      restaurant_id,
      customer_name,
      customer_email,
      customer_phone,
      date,
      time,
      number_of_people,
      notes: notes || ''
    });

    // Enviar webhook n8n para o restaurante específico (executa em background)
    if (restaurant.google_calendar_id) {
      // google_calendar_id agora armazena o webhook_url
      console.log(`🔗 Webhook URL encontrada: ${restaurant.google_calendar_id}`);
      // Disparar webhook assincronamente sem aguardar
      (async () => {
        try {
          await sendWebhook(restaurant.google_calendar_id, {
            type: 'agendamento',
            restaurantName: restaurant.name,
            restaurantId: restaurant.id,
            customerName: customer_name,
            customerEmail: customer_email,
            customerPhone: customer_phone,
            date: date,
            time: time,
            numberOfPeople: number_of_people,
            notes: notes,
            reservationId: reservation.id,
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          console.error('❌ Erro ao enviar webhook background:', err.message);
        }
      })();
    } else {
      console.log(`⚠️ Nenhum webhook URL configurado para restaurante ${restaurant.name}`);
    }

    res.status(201).json({
      message: 'Reserva criada com sucesso',
      reservation
    });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ message: 'Erro ao criar reserva', error: error.message });
  }
};

// Listar todas as reservas (para admin/owner)
exports.getAllReservations = async (req, res) => {
  try {
    const { restaurant_id, status } = req.query;
    
    const filters = {};
    if (restaurant_id) filters.restaurant_id = restaurant_id;
    if (status) filters.status = status;

    const reservations = await Reservation.findAll(filters);

    // Se o usuário é owner, filtrar apenas seus restaurantes
    if (req.user?.role === 'owner') {
      const ownerRestaurants = await Restaurant.findByOwnerId(req.userId);
      const ownerRestaurantIds = ownerRestaurants.map(r => r.id);
      
      const filteredReservations = reservations.filter(r => 
        ownerRestaurantIds.includes(r.restaurant_id)
      );
      
      return res.json(filteredReservations);
    }

    res.json(reservations);
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res.status(500).json({ message: 'Erro ao listar reservas', error: error.message });
  }
};

// Obter reserva por ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Erro ao obter reserva:', error);
    res.status(500).json({ message: 'Erro ao obter reserva', error: error.message });
  }
};

// Atualizar status da reserva
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const reservation = await Reservation.update(req.params.id, { status });

    res.json({
      message: 'Status da reserva atualizado com sucesso',
      reservation
    });
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ message: 'Erro ao atualizar reserva', error: error.message });
  }
};

// Deletar reserva
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    await Reservation.delete(req.params.id);

    res.json({ message: 'Reserva deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar reserva:', error);
    res.status(500).json({ message: 'Erro ao deletar reserva', error: error.message });
  }
};
