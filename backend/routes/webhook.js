const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

/**
 * Webhook genérico que trata dois tipos de operações:
 * 1. "consulta" - verifica disponibilidade na agenda (GET)
 * 2. "agendamento" - cria evento na agenda E alimenta a tabela de reservas (POST)
 */
router.post('/', async (req, res) => {
  try {
    const { type, restaurantId, restaurantName, customerName, customerEmail, customerPhone, date, time, numberOfPeople, notes, reservationId } = req.body;

    console.log(`\n📨 Webhoo recebido: type=${type}, restaurant=${restaurantName}`);

    if (!type) {
      return res.status(400).json({ message: 'Campo "type" é obrigatório (consulta|agendamento)' });
    }

    if (type === 'consulta') {
      // Verificar disponibilidade na agenda
      console.log(`🔍 Consultando disponibilidade em ${date} às ${time}`);
      
      // TODO: Integrar com Google Calendar / Calendly API
      // Por enquanto, retornar disponível
      return res.json({
        type: 'consulta',
        available: true,
        message: 'Data e hora disponíveis',
        date,
        time,
        restaurantId
      });
    }

    else if (type === 'agendamento') {
      // Criar reserva na tabela do Supabase
      if (!restaurantId || !customerName || !customerEmail || !customerPhone || !date || !time || !numberOfPeople) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando para agendamento' });
      }

      console.log(`📅 Criando agendamento: ${customerName} em ${date} às ${time}`);

      // Encontrar restaurante
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurante não encontrado' });
      }

      // Criar reserva no Supabase
      const reservation = await Reservation.create({
        restaurant_id: restaurantId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        date,        // Compatível com modelo que aceita date/time ou reservation_date/reservation_time
        time,
        number_of_people: parseInt(numberOfPeople),
        notes: notes || '',
        google_event_id: reservationId || ''
      });

      console.log(`✅ Agendamento criado com sucesso: ID ${reservation.id}`);

      return res.status(201).json({
        type: 'agendamento',
        message: 'Agendamento criado com sucesso',
        reservation: {
          id: reservation.id,
          status: reservation.status,
          customerName: reservation.customer_name,
          date: reservation.reservation_date || reservation.date,
          time: reservation.reservation_time || reservation.time,
          restaurant: restaurantName,
          numberOfPeople: reservation.number_of_people
        }
      });
    }

    else {
      return res.status(400).json({ message: 'Type deve ser "consulta" ou "agendamento"' });
    }

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    res.status(500).json({ message: 'Erro ao processar webhook', error: error.message });
  }
});

// Webhook para receber atualizações do n8n/Google Calendar
router.post('/calendar-update', async (req, res) => {
  try {
    const { eventId, status, calendarId } = req.body;

    // Encontrar reserva pelo eventId
    const reservation = await Reservation.findByGoogleEventId(eventId);
    
    if (reservation) {
      // Atualizar status baseado na resposta do Google Calendar
      let newStatus = reservation.status;
      if (status === 'cancelled') {
        newStatus = 'cancelled';
      } else if (status === 'confirmed') {
        newStatus = 'confirmed';
      }
      
      await Reservation.update(reservation.id, { status: newStatus });
    }

    res.json({ message: 'Webhook processado com sucesso', updated: !!reservation });
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).json({ message: 'Erro ao processar webhook', error: error.message });
  }
});

// Webhook para sincronizar disponibilidade
router.post('/sync-availability', async (req, res) => {
  try {
    const { calendarId, events } = req.body;

    // Encontrar restaurante pelo calendarId
    const restaurant = await Restaurant.findByGoogleCalendarId(calendarId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurante não encontrado' });
    }

    // Processar eventos e atualizar reservas
    // (Implementar lógica de sincronização conforme necessário)

    res.json({ message: 'Sincronização realizada com sucesso' });
  } catch (error) {
    console.error('Erro ao sincronizar:', error);
    res.status(500).json({ message: 'Erro ao sincronizar', error: error.message });
  }
});

module.exports = router;
