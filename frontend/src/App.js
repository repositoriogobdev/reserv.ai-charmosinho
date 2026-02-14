import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import RestaurantForm from './pages/RestaurantForm';
import Reservations from './pages/Reservations';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';

// Tema customizado: Branco com Azul
const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    primary: {
      main: '#0066cc', // Azul principal
      light: '#4da6ff',
      dark: '#004999'
    },
    secondary: {
      main: '#00539b', // Azul mais escuro
      light: '#4d94d9',
      dark: '#003d75'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#0066cc'
    },
    h6: {
      fontWeight: 600,
      color: '#333333'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px'
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0066cc 0%, #00539b 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #004999 0%, #003d75 100%)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 102, 204, 0.1)',
          border: '1px solid #e0e7ff'
        }
      }
    }
  }
});

function AppLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  // Mostrar Navbar/Sidebar apenas quando estiver autenticado
  const showNavbar = isAuthenticated && !location.pathname.startsWith('/reservas');

  return (
    <div className={`App ${showNavbar ? 'has-sidebar' : ''}`}>
      {/* Mostrar sidebar na área de gerenciamento (não em /reservas) */}
      {showNavbar && <Sidebar />}
      
      {/* Main content area */}
      <main className="app-main">
        {showNavbar && <Navbar />}
        
        <Routes>
          <Route path="/reservas" element={<Home />} />
          {/* Rota raiz volta a apontar para a Home (área de gerenciamento). A página pública de reservas fica em /reservas */}
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/booking/:restaurantId" element={<Booking />} />
          
          {/* Rotas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/restaurants" 
            element={
              <PrivateRoute>
                <Restaurants />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/restaurants/new" 
            element={
              <PrivateRoute>
                <RestaurantForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/restaurants/edit/:id" 
            element={
              <PrivateRoute>
                <RestaurantForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/reservations" 
            element={
              <PrivateRoute>
                <Reservations />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
