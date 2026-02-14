import React, { useState, useEffect, useCallback } from 'react';
import reservationService from '../services/reservationService';
import restaurantService from '../services/restaurantService';
import './backoffice.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRestaurant, setFilterRestaurant] = useState('all');
  const [restaurantsList, setRestaurantsList] = useState([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }
      if (filterRestaurant !== 'all') {
        filters.restaurant_id = filterRestaurant;
      }

      const [reservationsData, restaurantsData] = await Promise.all([
        reservationService.getAll(filters),
        restaurantService.getAll()
      ]);

      // Criar mapa de restaurantes
      const restaurantMap = {};
      restaurantsData.forEach(r => {
        restaurantMap[r.id] = r;
      });

      setReservations(reservationsData || []);
      setRestaurants(restaurantMap);
      setRestaurantsList(restaurantsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterRestaurant]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateStatus = async (reservationId, newStatus) => {
    try {
      await reservationService.updateStatus(reservationId, newStatus);
      loadData();
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const handleDelete = async (reservationId) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await reservationService.delete(reservationId);
        loadData();
      } catch (error) {
        alert('Erro ao cancelar reserva');
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando reservas...</div>;
  }

  return (
    <div className="reservations-management-container">
      <div className="reservations-header">
        <div>
          <h1>Gerenciamento de Reservas</h1>
          <p className="subtitle">Total de {reservations.length} reserva{reservations.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="reservations-filters">
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="cancelled">Cancelado</option>
            <option value="completed">Concluído</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Restaurante</label>
          <select 
            value={filterRestaurant} 
            onChange={(e) => setFilterRestaurant(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos os Restaurantes</option>
            {restaurantsList.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={loadData}
          className="filter-btn-refresh"
        >
          Atualizar
        </button>
      </div>

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma reserva encontrada com os filtros selecionados.</p>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-item">
              <div className="reservation-item-header">
                <div className="reservation-item-title">
                  <h3>{reservation.customer_name}</h3>
                  <span className={`status-badge status-${reservation.status}`}>
                    {reservation.status === 'pending' && 'Pendente'}
                    {reservation.status === 'confirmed' && 'Confirmado'}
                    {reservation.status === 'cancelled' && 'Cancelado'}
                    {reservation.status === 'completed' && 'Concluído'}
                  </span>
                </div>
                <div className="reservation-item-meta">
                  <span className="restaurant-tag">
                    {restaurants[reservation.restaurant_id]?.name || 'Restaurante'}
                  </span>
                </div>
              </div>

              <div className="reservation-item-content">
                <div className="info-row">
                  <label>Email</label>
                  <span>{reservation.customer_email}</span>
                </div>

                <div className="info-row">
                  <label>Telefone</label>
                  <span>{reservation.customer_phone}</span>
                </div>

                <div className="info-row">
                  <label>Pessoas</label>
                  <span>{reservation.number_of_people} {reservation.number_of_people === 1 ? 'pessoa' : 'pessoas'}</span>
                </div>

                <div className="info-row">
                  <label>Data</label>
                  <span>{new Date(reservation.reservation_date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                <div className="info-row">
                  <label>Horário</label>
                  <span>{reservation.reservation_time}</span>
                </div>

                {reservation.notes && (
                  <div className="info-row">
                    <label>Observações</label>
                    <span>{reservation.notes}</span>
                  </div>
                )}

                <div className="info-row">
                  <label>Criada em</label>
                  <span>{new Date(reservation.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="reservation-item-actions">
                {reservation.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
                      className="action-btn action-confirm"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
                      className="action-btn action-cancel"
                    >
                      Recusar
                    </button>
                  </>
                )}
                {reservation.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(reservation.id, 'completed')}
                      className="action-btn action-complete"
                    >
                      Concluir
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      className="action-btn action-delete"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {(reservation.status === 'cancelled' || reservation.status === 'completed') && (
                  <button
                    onClick={() => handleDelete(reservation.id)}
                    className="action-btn action-delete"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
