import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import restaurantService from '../services/restaurantService';
import reservationService from '../services/reservationService';
import './backoffice.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalReservations: 0,
    pendingReservations: 0,
    todayReservations: 0
  });
  const [recentReservations, setRecentReservations] = useState([]);
  const [restaurants, setRestaurants] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar restaurantes e reservas
      const [restaurantsData, reservationsData] = await Promise.all([
        restaurantService.getAll(),
        reservationService.getAll()
      ]);

      // Criar mapa de restaurantes por ID
      const restaurantMap = {};
      restaurantsData.forEach(restaurant => {
        restaurantMap[restaurant.id] = restaurant;
      });
      setRestaurants(restaurantMap);

      // Calcular data de hoje no mesmo formato que vem do backend
      const today = new Date().toISOString().split('T')[0];
      
      // Filtrar reservas de hoje (usando reservation_date)
      const todayRes = reservationsData.filter(r => {
        const resDate = r.reservation_date ? r.reservation_date.split('T')[0] : '';
        return resDate === today;
      });

      setStats({
        totalRestaurants: restaurantsData.length,
        totalReservations: reservationsData.length,
        pendingReservations: reservationsData.filter(r => r.status === 'pending').length,
        todayReservations: todayRes.length
      });

      // Pegar as 5 reservas mais recentes
      const recent = reservationsData
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
      setRecentReservations(recent);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Carregando dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Painel de Controle</h1>
        <p className="subtitle">Bem-vindo, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card stat-restaurants">
          <div className="stat-label">Restaurantes</div>
          <div className="stat-number">{stats.totalRestaurants}</div>
        </div>
        <div className="stat-card stat-total">
          <div className="stat-label">Total de Reservas</div>
          <div className="stat-number">{stats.totalReservations}</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-label">Reservas Pendentes</div>
          <div className="stat-number">{stats.pendingReservations}</div>
        </div>
        <div className="stat-card stat-today">
          <div className="stat-label">Reservas Hoje</div>
          <div className="stat-number">{stats.todayReservations}</div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Reservas Recentes</h2>
        <div className="recent-reservations-card">
          {recentReservations.length === 0 ? (
            <div className="recent-reservations-empty">
              <p>Nenhuma reserva ainda</p>
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Restaurante</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Pessoas</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="table-restaurant-name">
                      {restaurants[reservation.restaurant_id]?.name || 'Restaurante'}
                    </td>
                    <td className="table-customer-name">{reservation.customer_name}</td>
                    <td>{new Date(reservation.reservation_date).toLocaleDateString('pt-BR')}</td>
                    <td className="table-time">{reservation.reservation_time}</td>
                    <td>{reservation.number_of_people}</td>
                    <td>
                      <span className={`badge badge-${reservation.status}`}>
                        {reservation.status === 'pending' && 'Pendente'}
                        {reservation.status === 'confirmed' && 'Confirmado'}
                        {reservation.status === 'cancelled' && 'Cancelado'}
                        {reservation.status === 'completed' && 'Concluído'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
