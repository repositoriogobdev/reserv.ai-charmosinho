# Estrutura do Projeto Reserv.ai

```
reserv.ai/
│
├── 📄 README.md                          # Documentação principal
├── 📄 install.sh                         # Script de instalação
├── 📄 start.sh                           # Script para iniciar aplicação
├── 📄 stop.sh                            # Script para parar aplicação
│
├── 📁 backend/                           # Backend Node.js
│   ├── 📄 package.json                   # Dependências do backend
│   ├── 📄 server.js                      # Servidor Express principal
│   ├── 📄 .env.example                   # Exemplo de variáveis de ambiente
│   ├── 📄 .gitignore
│   │
│   ├── 📁 models/                        # Modelos do MongoDB
│   │   ├── 📄 User.js                    # Modelo de usuário
│   │   ├── 📄 Restaurant.js              # Modelo de restaurante
│   │   └── 📄 Reservation.js             # Modelo de reserva
│   │
│   ├── 📁 controllers/                   # Lógica de negócio
│   │   ├── 📄 authController.js          # Login, registro, perfil
│   │   ├── 📄 restaurantController.js    # CRUD de restaurantes
│   │   ├── 📄 reservationController.js   # CRUD de reservas
│   │   └── 📄 availabilityController.js  # Verificação de disponibilidade
│   │
│   ├── 📁 routes/                        # Rotas da API
│   │   ├── 📄 auth.js                    # Rotas de autenticação
│   │   ├── 📄 restaurants.js             # Rotas de restaurantes
│   │   ├── 📄 reservations.js            # Rotas de reservas
│   │   ├── 📄 availability.js            # Rotas de disponibilidade
│   │   └── 📄 webhook.js                 # Rotas de webhook (n8n)
│   │
│   └── 📁 middleware/                    # Middlewares
│       └── 📄 auth.js                    # Autenticação JWT
│
├── 📁 frontend/                          # Frontend React
│   ├── 📄 package.json                   # Dependências do frontend
│   ├── 📄 .env.example                   # Exemplo de variáveis de ambiente
│   ├── 📄 .gitignore
│   │
│   ├── 📁 public/
│   │   └── 📄 index.html                 # HTML principal
│   │
│   └── 📁 src/
│       ├── 📄 index.js                   # Entry point
│       ├── 📄 index.css                  # Estilos globais
│       ├── 📄 App.js                     # Componente principal
│       │
│       ├── 📁 components/                # Componentes reutilizáveis
│       │   ├── 📄 Navbar.js              # Barra de navegação
│       │   └── 📄 PrivateRoute.js        # Rota protegida
│       │
│       ├── 📁 pages/                     # Páginas da aplicação
│       │   ├── 📄 Home.js                # Página inicial (lista restaurantes)
│       │   ├── 📄 Login.js               # Página de login
│       │   ├── 📄 Register.js            # Página de cadastro
│       │   ├── 📄 Booking.js             # Página de agendamento público
│       │   ├── 📄 Dashboard.js           # Dashboard do owner
│       │   ├── 📄 Restaurants.js         # Lista de restaurantes do owner
│       │   ├── 📄 RestaurantForm.js      # Formulário de restaurante
│       │   └── 📄 Reservations.js        # Gerenciar reservas
│       │
│       ├── 📁 services/                  # Serviços de API
│       │   ├── 📄 api.js                 # Configuração axios
│       │   ├── 📄 authService.js         # Serviços de autenticação
│       │   ├── 📄 restaurantService.js   # Serviços de restaurantes
│       │   └── 📄 reservationService.js  # Serviços de reservas
│       │
│       └── 📁 context/                   # Context API
│           └── 📄 AuthContext.js         # Contexto de autenticação
│
└── 📁 docs/                              # Documentação
    ├── 📄 QUICK_START.md                 # Guia rápido de início
    ├── 📄 N8N_INTEGRATION.md             # Documentação integração n8n
    │
    └── 📁 n8n-workflows/                 # Workflows prontos para n8n
        ├── 📄 check-availability-workflow.json
        ├── 📄 create-event-workflow.json
        └── 📄 cancel-event-workflow.json
```

## 📊 Estatísticas do Projeto

### Backend
- **Modelos**: 3 (User, Restaurant, Reservation)
- **Controllers**: 4 (Auth, Restaurant, Reservation, Availability)
- **Rotas**: 5 arquivos (Auth, Restaurants, Reservations, Availability, Webhook)
- **Endpoints API**: ~20 endpoints

### Frontend
- **Páginas**: 8 (Home, Login, Register, Booking, Dashboard, Restaurants, RestaurantForm, Reservations)
- **Componentes**: 2 (Navbar, PrivateRoute)
- **Serviços**: 4 (API, Auth, Restaurant, Reservation)
- **Context**: 1 (Auth)

### Total de Arquivos
- **Backend**: ~15 arquivos principais
- **Frontend**: ~20 arquivos principais
- **Documentação**: 5 arquivos
- **Scripts**: 3 arquivos shell
- **Total**: ~43 arquivos principais

## 🔌 Fluxo de Dados

```
Cliente → Frontend (React) 
           ↓
       API REST (Express)
           ↓
       MongoDB (Database)
           ↓
       n8n Webhook
           ↓
    Google Calendar API
```

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação
- Registro de usuários (Customer/Owner)
- Login com JWT
- Proteção de rotas

### ✅ Gestão de Restaurantes (Owner)
- Criar restaurante
- Editar restaurante
- Desativar restaurante
- Listar meus restaurantes
- Configurar horários de funcionamento
- Integração com Google Calendar

### ✅ Sistema de Reservas
- Criar reserva (público)
- Consultar disponibilidade em tempo real
- Gerenciar reservas (owner)
- Atualizar status (pending, confirmed, cancelled, completed)
- Cancelar/Deletar reservas
- Sincronização com Google Calendar via n8n

### ✅ Dashboard
- Estatísticas gerais
- Reservas recentes
- Métricas do dia

### ✅ Webhooks
- Verificar disponibilidade (n8n → Google Calendar)
- Criar evento (reserva → Google Calendar)
- Cancelar evento
- Sincronização bidirecional

## 🎨 Features de UI/UX
- Design responsivo
- Navegação intuitiva
- Formulários validados
- Feedback visual (loading, errors, success)
- Badges de status coloridos
- Filtros de reservas
- Link compartilhável de agendamento

## 🔒 Segurança
- Senhas criptografadas (bcrypt)
- Autenticação JWT
- Middleware de autorização
- Validação de dados
- CORS configurado
- Rotas protegidas por papel (owner/admin)
