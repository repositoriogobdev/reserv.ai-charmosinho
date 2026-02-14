import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <nav className="navbar compact">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="navbar-brand" aria-label="Reserv.ai"></div>
          <span className="navbar-slogan badge">Dia & noite, todo dia!</span>
        </div>
        <div className="navbar-actions">
          {isAuthenticated && (
            <div className="navbar-info">
              <span className="navbar-badge">Olá, {user?.name}</span>
              <span className="navbar-date">{currentDate}</span>
            </div>
          )}
          {!isAuthenticated && (
            <div>
              <Link to="/login" style={{ marginRight: 8, color: 'white' }}>Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
