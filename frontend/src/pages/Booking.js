import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import restaurantService from '../services/restaurantService';
import reservationService from '../services/reservationService';

const Booking = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    numberOfPeople: 2,
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadRestaurant = useCallback(async () => {
    try {
      const data = await restaurantService.getById(restaurantId);
      setRestaurant(data);
    } catch (error) {
      setError('Erro ao carregar restaurante');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  const loadAvailability = useCallback(async () => {
    try {
      const data = await reservationService.getAvailability(restaurantId, formData.date);
      setAvailableSlots(data.availableSlots || []);
    } catch (error) {
      console.error('Erro ao carregar disponibilidade:', error);
      setAvailableSlots([]);
    }
  }, [restaurantId, formData.date]);

  useEffect(() => {
    loadRestaurant();
  }, [loadRestaurant]);

  useEffect(() => {
    if (formData.date) {
      loadAvailability();
    }
  }, [formData.date, loadAvailability]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await reservationService.create({
        restaurant_id: restaurantId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        date: formData.date,
        time: formData.time,
        number_of_people: parseInt(formData.numberOfPeople),
        notes: formData.notes
      });

      setSuccess('Reserva criada com sucesso! Você receberá uma confirmação por email.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        numberOfPeople: 2,
        notes: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar reserva');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!restaurant) {
    return (
      <div className="container">
        <div className="card">
          <p style={{ textAlign: 'center', color: '#dc3545' }}>Restaurante não encontrado</p>
        </div>
      </div>
    );
  }

  const coverImage = restaurant?.['url-foto'] || restaurant?.['url-fotos'] || restaurant?.url_fotos || restaurant?.urlFotos || '';

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '30px' }}>
      <div className="card">
        {coverImage && (
          <div style={{ marginBottom: '20px' }}>
            <img
              src={coverImage}
              alt={restaurant.name}
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        )}
        <h2>{restaurant.name}</h2>
        <p style={{ color: '#666', margin: '10px 0' }}>{restaurant.description}</p>
        <div style={{ marginTop: '15px', marginBottom: '30px' }}>
          <p><strong>Endereço:</strong> {restaurant.address?.street}, {restaurant.address?.city}</p>
          <p><strong>Telefone:</strong> {restaurant.phone}</p>
          <p><strong>Capacidade:</strong> {restaurant.capacity} pessoas</p>
        </div>

        <h3 style={{ marginBottom: '20px' }}>Fazer Reserva</h3>

        {success && (
          <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', marginBottom: '20px' }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Nome *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Telefone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Número de Pessoas *</label>
              <input
                type="number"
                name="numberOfPeople"
                value={formData.numberOfPeople}
                onChange={handleChange}
                min="1"
                max={restaurant.capacity}
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Data *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Horário *</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um horário</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {formData.date && availableSlots.length === 0 && (
                <p className="error">Nenhum horário disponível para esta data</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informações adicionais, preferências, alergias, etc."
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-success" 
            style={{ width: '100%' }}
            disabled={submitting || !formData.time}
          >
            {submitting ? 'Criando Reserva...' : 'Confirmar Reserva'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
