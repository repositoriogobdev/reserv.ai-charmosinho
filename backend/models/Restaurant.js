const { supabaseAdmin, supabaseClient } = require('../config/supabase');

// Remove aspas externas e espaços de uma string
function extractCoverPhotoUrl(source = {}) {
  return source.url_fotos || source.urlFotos || source['url-foto'] || source['url-fotos'] || '';
}

function stripQuotes(s) {
  if (!s && s !== '') return s;
  try {
    return String(s).replace(/^\"+|\"+$/g, '').trim();
  } catch (e) {
    return s;
  }
}

// Normaliza um address que pode ser string (JSON ou text) ou objeto
function normalizeAddress(raw) {
  const empty = { street: '', city: '', state: '', zipCode: '', country: 'Brasil' };
  if (raw === null || raw === undefined) return empty;

  // Se for string, tentar parsear JSON, senão usar como street
  if (typeof raw === 'string') {
    const cleaned = stripQuotes(raw);
    try {
      const parsed = JSON.parse(cleaned);
      return normalizeAddress(parsed);
    } catch (e) {
      return { ...empty, street: cleaned };
    }
  }

  // Se for objeto, mapear campos conhecidos
  if (typeof raw === 'object') {
    return {
      street: stripQuotes(raw.street || raw.address || raw.street_address || ''),
      city: raw.city || raw.town || '',
      state: raw.state || raw.region || '',
      zipCode: raw.zipCode || raw.zip || raw.postalCode || '',
      country: raw.country || 'Brasil'
    };
  }

  return empty;
}

class Restaurant {
  // Criar novo restaurante
  static async create(restaurantData) {
    try {
      const updatePayload = { ...restaurantData };
      const coverPhotoUrl = extractCoverPhotoUrl(updatePayload);
      if (coverPhotoUrl) {
        updatePayload['url-foto'] = coverPhotoUrl;
      }
      delete updatePayload.urlFotos;
      delete updatePayload.url_fotos;
      delete updatePayload['url-fotos'];
      const { owner_id, name, description, address, phone, email, capacity, opening_hours, reservation_duration, google_calendar_id } = restaurantData;

      // Normalizar address: aceitar objeto, string JSON ou string simples
      const normalizedAddress = normalizeAddress(address);

      const { data, error } = await supabaseAdmin
        .from('restaurants')
        .insert([
          {
            name: name.trim(),
            owner_id,
            description: description?.trim() || '',
            address: normalizedAddress,
            phone: phone?.trim() || '',
            email: email?.toLowerCase().trim() || '',
            capacity: parseInt(capacity),
            opening_hours: opening_hours || {},
            reservation_duration: reservation_duration || 120,
            active: true,
            google_calendar_id: google_calendar_id?.trim() || '',
            ...(coverPhotoUrl ? { ['url-fotos']: coverPhotoUrl } : {}),
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Erro ao criar restaurante: ${error.message}`);
    }
  }

  // Encontrar por ID
  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Erro ao buscar restaurante: ${error.message}`);
    }
  }

  // Encontrar todos os restaurantes de um dono
  static async findByOwnerId(owner_id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('restaurants')
        .select('*')
        .eq('owner_id', owner_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Erro ao buscar restaurantes: ${error.message}`);
    }
  }

  // Listar todos os restaurantes ativos
  static async findAllActive() {
    try {
      const { data, error } = await supabaseAdmin
        .from('restaurants')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Erro ao listar restaurantes: ${error.message}`);
    }
  }

  // Atualizar restaurante
  static async update(id, updateData) {
    try {
      // Normalizar address no update também
      const updatePayload = { ...updateData };
      if (updatePayload.address) {
        updatePayload.address = normalizeAddress(updatePayload.address);
      }

      const coverPhotoUrl = extractCoverPhotoUrl(updatePayload);
      if (coverPhotoUrl) {
        updatePayload['url-foto'] = coverPhotoUrl;
      }
      delete updatePayload.urlFotos;
      delete updatePayload.url_fotos;
      delete updatePayload['url-fotos'];

      const { data, error } = await supabaseAdmin
        .from('restaurants')
        .update({
          ...updatePayload,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar restaurante: ${error.message}`);
    }
  }

  // Deletar restaurante
  static async delete(id) {
    try {
      const { error } = await supabaseAdmin
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar restaurante: ${error.message}`);
    }
  }

  // Encontrar por Google Calendar ID
  static async findByGoogleCalendarId(calendarId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('restaurants')
        .select('*')
        .eq('google_calendar_id', calendarId)
        .single();

      if (error && error.code === 'PGRST116') return null;
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Erro ao buscar restaurante por Google Calendar ID: ${error.message}`);
    }
  }
}

module.exports = Restaurant;
