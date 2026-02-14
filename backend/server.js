const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Verificar variáveis do Supabase
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Aviso: Variáveis do Supabase não estão configuradas. Configure o arquivo .env');
}

const app = express();

// Middlewares
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(origin => origin.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/webhook', require('./routes/webhook'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Reserv.ai está rodando!' });
});

// Rotas health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Iniciar servidor (sem MongoDB obrigatório)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Acesse: http://localhost:${PORT}`);
});

module.exports = app;
