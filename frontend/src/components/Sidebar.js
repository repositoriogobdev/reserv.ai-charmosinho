import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

// SVG Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <rect x="1" y="3" width="8" height="8" strokeWidth="1.5" />
    <rect x="11" y="3" width="8" height="8" strokeWidth="1.5" />
    <rect x="1" y="11" width="8" height="8" strokeWidth="1.5" />
    <rect x="11" y="11" width="8" height="8" strokeWidth="1.5" />
  </svg>
);

const RestaurantIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path d="M2 18h16M4 3h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 6v8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ReservationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
    <path d="M3 2h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" strokeWidth="1.5" />
    <path d="M6 6h8M6 10h8M6 14h5" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="6" y1="1" x2="6" y2="4" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="1" x2="14" y2="4" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CollapseIcon = ({ collapsed }) => (
  collapsed ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <path d="M11 3L6 9l5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <path d="M7 3l5 6-5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
);

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <div className="brand">Reserv.ai</div>
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            title={collapsed ? 'Expandir' : 'Recolher'}
          >
            <CollapseIcon collapsed={collapsed} />
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
          

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
