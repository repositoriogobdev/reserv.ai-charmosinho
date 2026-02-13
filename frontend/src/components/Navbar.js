import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isOwner } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar compact">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">Reserv.ai</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated && <span style={{ color: 'white' }}>Olá, {user?.name}</span>}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-secondary">Sair</button>
          ) : (
            <div>
              <Link to="/login" style={{ marginRight: 8, color: 'white' }}>Login</Link>
              <Link to="/register" style={{ color: 'white' }}>Cadastrar</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
