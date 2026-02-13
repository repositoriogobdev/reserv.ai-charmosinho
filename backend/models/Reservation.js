const { supabaseAdmin, supabaseClient } = require('../config/supabase');

class Reservation {
  // Criar nova reserva
  static async create(reservationData) {
    try {
      const {
        restaurant_id,
        customer_name,
        customer_email,
        customer_phone,
        date,
        time,
        reservation_date,
        reservation_time,
        number_of_people,
        notes = '',
        google_event_id = '',
        status = 'confirmed'
      } = reservationData;

      // Aceita tanto 'date' quanto 'reservation_date' para compatibilidade
      const finalDate = reservation_date || date;
      const finalTime = reservation_time || time;

      const { data, error } = await supabaseAdmin
        .from('reservations')
        .insert([
          {
            restaurant_id,
            customer_name: customer_name.trim(),
            customer_email: customer_email.toLowerCase().trim(),
            customer_phone: customer_phone.trim(),
            reservation_date: finalDate,
            reservation_time: finalTime,
            number_of_people: parseInt(number_of_people),
            status: status,
            notes: notes.trim(),
            google_event_id: google_event_id.trim()
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Erro ao criar reserva: ${error.message}`);
    }
  }

  // Encontrar por ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Erro ao buscar reserva: ${error.message}`);
    }
  }

  // Encontrar por Google Event ID (usado pelos webhooks)
  static async findByGoogleEventId(eventId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .select('*')
        .eq('google_event_id', eventId)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Erro ao buscar reserva por Google Event ID: ${error.message}`);
    }
  }

  // Encontrar reservas de um restaurante
  static async findByRestaurantId(restaurant_id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .select('*')
        .eq('restaurant_id', restaurant_id)
        .order('reservation_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Erro ao buscar reservas: ${error.message}`);
    }
  }

  // Encontrar reservas por período
  static async findByDateRange(restaurant_id, startDate, endDate) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .select('*')
        .eq('restaurant_id', restaurant_id)
        .gte('reservation_date', startDate)
        .lte('reservation_date', endDate)
        .order('reservation_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Erro ao buscar reservas por período: ${error.message}`);
    }
  }

  // Atualizar reserva
  static async update(id, updateData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('reservations')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar reserva: ${error.message}`);
    }
  }

  // Deletar reserva
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar reserva: ${error.message}`);
    }
  }

  // Listar todas as reservas com filtros opcionais
  static async findAll(filters = {}) {
    try {
      let query = supabaseAdmin.from('reservations').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.restaurant_id) {
        query = query.eq('restaurant_id', filters.restaurant_id);
      }

      const { data, error } = await query.order('reservation_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Erro ao listar reservas: ${error.message}`);
    }
  }
}

module.exports = Reservation;
