import api from './api';

const restaurantService = {
  async getAll() {
    const response = await api.get('/restaurants');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  async getOwnerRestaurants() {
    const response = await api.get('/restaurants/owner/my-restaurants');
    return response.data;
  },

  async create(restaurantData) {
    const response = await api.post('/restaurants', restaurantData);
    return response.data;
  },

  async update(id, restaurantData) {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  }
};

export default restaurantService;
