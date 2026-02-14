import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './sidebar.css';

// SVG Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
  </svg>
);

const RestaurantIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10a8 8 0 0 1 16 0" />
    <path d="M4 10h16" />
    <path d="M6 10v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9" />
    <path d="M9 6h6" />
  </svg>
);

const ReservationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="3" />
    <path d="M8 2v4M16 2v4" />
    <path d="M7 10h10" />
    <path d="M7 14h6" />
  </svg>
);

const Sidebar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Reset mobile open state when resizing to desktop
      if (!mobile && mobileOpen) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  // Close mobile sidebar when navigating
  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Close sidebar when clicking backdrop on mobile
  const handleBackdropClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <div 
          className={`sidebar-backdrop ${mobileOpen ? 'visible' : ''}`}
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${isMobile && mobileOpen ? 'mobile-open' : ''}`}
        aria-label="Menu de navegação"
      >
        <div className="sidebar-header">
          <button
            type="button"
            className="brand-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            title={collapsed ? 'Expandir' : 'Recolher'}
          >
            <img src={logo} alt="Logo" className="brand-logo" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => isActive ? 'active' : ''}
            onClick={handleNavClick}
            title="Painel de Controle"
          >
            <span className="nav-icon">
              <DashboardIcon />
            </span>
            <span className="nav-label">Painel</span>
          </NavLink>
          
          <NavLink 
            to="/restaurants" 
            className={({isActive}) => isActive ? 'active' : ''}
            onClick={handleNavClick}
            title="Meus Restaurantes"
          >
            <span className="nav-icon">
              <RestaurantIcon />
            </span>
            <span className="nav-label">Restaurantes</span>
          </NavLink>
          
          <NavLink 
            to="/reservations" 
            className={({isActive}) => isActive ? 'active' : ''}
            onClick={handleNavClick}
            title="Reservas"
          >
            <span className="nav-icon">
              <ReservationIcon />
            </span>
            <span className="nav-label">Reservas</span>
          </NavLink>
          
          {isAuthenticated && (
            <button
              type="button"
              className="sidebar-logout"
              onClick={() => {
                handleNavClick();
                handleLogout();
              }}
            >
              Sair
            </button>
          )}
          <div className="sidebar-footer">
            Feito com 🤍 por Pietro Medeiros.
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
