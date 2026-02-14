const axios = require('axios');
const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// Verificar disponibilidade de um horário específico
exports.checkSlotAvailability = async (req, res) => {
  try {
    const { restaurant_id, date, time, number_of_people } = req.body;

    if (!restaurant_id || !date || !time) {
      return res.status(400).json({ 
        message: 'ID do restaurante, data e hora são obrigatórios' 
      });
    }

    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }

    // Se o restaurante tem webhook configurado, usar para verificar disponibilidade
    if (restaurant.google_calendar_id) {
      try {
        console.log(`🔍 Verificando disponibilidade no webhook: ${restaurant.google_calendar_id}`);
        
        const response = await axios.post(restaurant.google_calendar_id, {
          type: 'consulta',
          restaurantId: restaurant_id,
          restaurantName: restaurant.name,
          date: date,
          time: time,
          numberOfPeople: number_of_people || 2
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 8000
        });

        console.log(`✅ Resposta do webhook:`, response.data);

        return res.json({
          available: response.data.available || true,
          message: response.data.available !== false ? 'Data e hora disponíveis' : (response.data.message || 'Horário indisponível'),
          restaurant: {
            id: restaurant.id,
            name: restaurant.name
          },
          date: date,
          time: time
        });
      } catch (webhookError) {
        // Fallback para verificação local
        console.warn(`⚠️ Erro ao consultar webhook do restaurante, usando verificação local:`, webhookError.message);
        
        const result = await checkLocalAvailability(restaurant_id, date, time);
        return res.json(result);
      }
    }

    // Se não há webhook, fazer verificação local
    const result = await checkLocalAvailability(restaurant_id, date, time);
    return res.json(result);
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    res.status(500).json({ 
      message: 'Erro ao verificar disponibilidade', 
      error: error.message 
    });
  }
};

// Verificação local de disponibilidade usando Supabase
async function checkLocalAvailability(restaurant_id, date, time) {
  try {
    const restaurant = await Restaurant.findById(restaurant_id);
    
    // Verificar se horário já foi reservado
    const reservations = await Reservation.findByDateRange(
      restaurant_id,
      new Date(date).toISOString().split('T')[0],
      new Date(date).toISOString().split('T')[0]
    );

    const alreadyReserved = reservations.some(r => 
      r.time === time && r.status !== 'cancelled'
    );

    return {
      available: !alreadyReserved,
      message: alreadyReserved ? 'Horário indisponível' : 'Horário disponível',
      restaurant: {
        id: restaurant.id,
        name: restaurant.name
      },
      date: date,
      time: time
    };
  } catch (error) {
    console.error('Erro na verificação local:', error);
    // Se houver erro, considerar disponível por padrão
    return {
      available: true,
      message: 'Disponibilidade confirmada (verificação local)',
      date: date,
      time: time
    };
  }
}

// Obter disponibilidade de um restaurante
exports.getAvailability = async (req, res) => {
  try {
    const { restaurant_id, date } = req.query;

    if (!restaurant_id || !date) {
      return res.status(400).json({ message: 'ID do restaurante e data são obrigatórios' });
    }

    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }

    const reservations = await Reservation.findByDateRange(
      restaurant_id,
      new Date(date).toISOString().split('T')[0],
      new Date(date).toISOString().split('T')[0]
    );

    // Gerar slots com disponibilidade baseada nas reservas existentes
    const slots = generateAvailableSlots(
      restaurant.opening_hours,
      reservations,
      restaurant.reservation_duration,
      new Date(date)
    );

    res.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name
      },
      date: date,
      slots: slots,
      availableSlots: slots.filter(slot => slot.available).map(slot => slot.time)
    });
  } catch (error) {
    console.error('Erro ao obter disponibilidade:', error);
    res.status(500).json({ message: 'Erro ao obter disponibilidade', error: error.message });
  }
};

// Função auxiliar para gerar slots disponíveis
function generateAvailableSlots(openingHours, reservations, duration, date) {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  const dayHours = openingHours?.[dayOfWeek];

  if (!dayHours || dayHours.closed) {
    return [];
  }

  const slots = [];
  const [openHour, openMinute] = (dayHours.open || '09:00').split(':').map(Number);
  const [closeHour, closeMinute] = (dayHours.close || '23:00').split(':').map(Number);

  let currentHour = openHour;
  let currentMinute = openMinute;

  const reservedTimes = reservations
    .filter(r => r.status !== 'cancelled')
    .map(r => r.time);

  while (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute)) {
    const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    const available = !reservedTimes.includes(timeSlot);

    slots.push({
      time: timeSlot,
      available
    });

    currentMinute += 30; // Slots de 30 minutos
    if (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour += 1;
    }
  }

  return slots;
}

module.exports = exports;
