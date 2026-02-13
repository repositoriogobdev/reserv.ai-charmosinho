import api from './api';

const reservationService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/reservations?${params}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  async create(reservationData) {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.put(`/reservations/${id}/status`, { status });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },

  async getAvailability(restaurantId, date) {
    const response = await api.get(`/availability?restaurant_id=${restaurantId}&date=${date}`);
    return response.data;
  },

  async checkSlotAvailability(restaurantId, date, time, numberOfPeople = 2) {
    const response = await api.post('/availability/check', {
      restaurant_id: restaurantId,
      date,
      time,
      number_of_people: numberOfPeople
    });
    return response.data;
  }
};

export default reservationService;
