import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import restaurantService from '../services/restaurantService';
import { addressToString } from '../utils/address';
import './backoffice.css';

const getCoverPhotoUrl = (restaurant) =>
  restaurant?.['url-foto'] || restaurant?.['url-fotos'] || restaurant?.url_fotos || restaurant?.urlFotos || '';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  // Recarregar restaurantes quando a aba ficar visível (útil após editar e voltar)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadRestaurants();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantService.getOwnerRestaurants();
      // Normalizar o formato dos restaurantes para garantir que tenhamos 'id' consistente
      const normalized = (data || []).map(r => ({
        ...r,
        id: r.id || r._id || r.ID || null,
        // garantir endereço como objeto quando possível
        address: typeof r.address === 'string' ? { street: r.address } : (r.address || {})
      }));
      setRestaurants(normalized);
    } catch (error) {
      console.error('Erro ao carregar restaurantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este restaurante?')) {
      try {
        await restaurantService.delete(id);
        loadRestaurants();
      } catch (error) {
        alert('Erro ao desativar restaurante');
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando restaurantes...</div>;
  }

  return (
    <div className="restaurants-container">
      <div className="restaurants-header">
        <h1>Meus Restaurantes</h1>
        <Link to="/restaurants/new" className="btn-new">
          + Novo Restaurante
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="restaurants-empty-state">
          <p>Você ainda não cadastrou nenhum restaurante.</p>
          <Link to="/restaurants/new" className="btn-empty">
            Cadastrar Primeiro Restaurante
          </Link>
        </div>
      ) : (
        <div className="restaurants-grid">
          {restaurants.map((restaurant) => {
            const coverImage = getCoverPhotoUrl(restaurant);
            return (
              <div key={restaurant.id} className="restaurant-card fade-in">
                <div className="restaurant-card-image">
                  {coverImage ? (
                    <img src={coverImage} alt={restaurant.name} />
                  ) : (
                    <div className="restaurant-card-image-placeholder">
                      Sem imagem de capa
                    </div>
                  )}
                </div>

                <div className="restaurant-card-header">
                  <h3 className="restaurant-card-title">{restaurant.name}</h3>
                  <span className={`restaurant-card-badge ${restaurant.active ? 'active' : 'inactive'}`}>
                    {restaurant.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <p className="restaurant-card-description">
                  {restaurant.description || 'Sem descrição'}
                </p>

                <div className="restaurant-card-details">
                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">Endereço:</span>
                    <span className="restaurant-detail-value">
                      {(() => {
                        const full = addressToString(restaurant.address);
                        const parts = full.split(',').map(p => p.trim()).filter(Boolean);
                        const street = parts.shift() || '';
                        const cityState = parts.join(', ');
                        return (
                          <div>
                            {street}
                            {cityState && <div>{cityState}</div>}
                          </div>
                        );
                      })()}
                    </span>
                  </div>

                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">Telefone:</span>
                    <span className="restaurant-detail-value">{restaurant.phone}</span>
                  </div>

                  <div className="restaurant-detail-row">
                    <span className="restaurant-detail-label">Capacidade:</span>
                    <span className="restaurant-detail-value">{restaurant.capacity} pessoas</span>
                  </div>
                </div>

                <div className="restaurant-card-actions">
                  <div className="restaurant-card-actions-main">
                    {restaurant.id ? (
                      <Link to={`/restaurants/edit/${restaurant.id}`} className="btn btn-card btn-card-primary">
                        Editar
                      </Link>
                    ) : (
                      <button className="btn btn-card btn-card-primary" disabled title="ID do restaurante ausente">
                        Editar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(restaurant.id)}
                      className="btn btn-card btn-card-danger"
                    >
                      Desativar
                    </button>
                  </div>
                  <Link 
                    to={`/booking/${restaurant.id}`} 
                    target="_blank"
                    className="btn btn-card btn-card-secondary"
                  >
                    Link de Reserva
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
