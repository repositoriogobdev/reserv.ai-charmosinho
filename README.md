# Reserv.ai - Plataforma de Agendamento de Reservas para Restaurantes

Sistema completo de gerenciamento e agendamento de reservas para restaurantes, com integração ao Google Calendar via n8n.

## 🚀 Funcionalidades

### Backoffice (Donos de Restaurantes)
- ✅ Cadastro e gestão de restaurantes
- ✅ Configuração de horários de funcionamento
- ✅ Gerenciamento de capacidade e unidades
- ✅ Visualização de todas as reservas
- ✅ Alteração de status das reservas (pendente, confirmada, cancelada, concluída)
- ✅ Dashboard com estatísticas
- ✅ Integração com Google Calendar

### Agendamento Público
- ✅ Visualização de restaurantes disponíveis
- ✅ Consulta de disponibilidade em tempo real
- ✅ Criação de reservas
- ✅ Confirmação por email
- ✅ Link único para cada restaurante

## 🛠️ Tecnologias

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT (autenticação)
- Bcrypt (criptografia)
- Axios (requisições HTTP)

### Frontend
- React 18
- React Router DOM
- Axios
- CSS personalizado

### Integrações
- n8n (automação de workflows)
- Google Calendar API

## 📋 Pré-requisitos

- Node.js 16+ e npm
- MongoDB instalado e rodando
- Conta n8n (cloud ou self-hosted)
- Conta Google Cloud com Calendar API habilitada

## 🔧 Instalação

### 1. Clone o repositório

```bash
cd reserv.ai
```

### 2. Configure o Backend

```bash
cd backend
npm install

# Copie o arquivo de exemplo e configure
cp .env.example .env

# Edite o .env com suas configurações:
# - MONGODB_URI: URL do seu MongoDB
# - JWT_SECRET: Uma chave secreta forte
# - N8N_WEBHOOK_URL: URL do seu n8n
```

### 3. Configure o Frontend

```bash
cd ../frontend
npm install

# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env:
# REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Configure o n8n

Veja a documentação completa em [docs/N8N_INTEGRATION.md](docs/N8N_INTEGRATION.md)

## ▶️ Executar a Aplicação

### Iniciar MongoDB

```bash
# Se estiver usando MongoDB local
mongod
```

### Iniciar Backend

```bash
cd backend
npm run dev
# Servidor rodando em http://localhost:5000
```

### Iniciar Frontend

```bash
cd frontend
npm start
# Aplicação rodando em http://localhost:3000
```

## 👥 Uso

### 1. Criar Conta de Dono de Restaurante

1. Acesse http://localhost:3000/register
2. Preencha os dados
3. Selecione "Dono de Restaurante"
4. Cadastre-se

### 2. Cadastrar Restaurante

1. Faça login
2. Vá em "Meus Restaurantes"
3. Clique em "Novo Restaurante"
4. Preencha todas as informações:
   - Dados básicos (nome, descrição, telefone)
   - Endereço completo
   - Capacidade
   - Horários de funcionamento
   - Google Calendar ID (obtenha do Google Calendar)
5. Salve

### 3. Compartilhar Link de Reserva

Cada restaurante tem um link único:
```
http://localhost:3000/booking/{restaurantId}
```

Compartilhe este link com seus clientes!

### 4. Gerenciar Reservas

1. Acesse "Reservas" no menu
2. Filtre por restaurante, status ou data
3. Altere o status conforme necessário
4. Exclua reservas se necessário

## 📁 Estrutura do Projeto

```
reserv.ai/
├── backend/
│   ├── controllers/         # Lógica de negócio
│   ├── models/             # Modelos do banco de dados
│   ├── routes/             # Rotas da API
│   ├── middleware/         # Middlewares (auth, etc)
│   ├── server.js           # Servidor principal
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── context/        # Context API (Auth)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── docs/
    └── N8N_INTEGRATION.md  # Documentação n8n
```

## 🔐 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Obter perfil (protegido)

### Restaurantes
- `GET /api/restaurants` - Listar todos (público)
- `GET /api/restaurants/:id` - Obter por ID (público)
- `GET /api/restaurants/owner/my-restaurants` - Listar do owner (protegido)
- `POST /api/restaurants` - Criar (protegido - owner)
- `PUT /api/restaurants/:id` - Atualizar (protegido - owner)
- `DELETE /api/restaurants/:id` - Desativar (protegido - owner)

### Reservas
- `POST /api/reservations` - Criar (público)
- `GET /api/reservations` - Listar (protegido - owner)
- `GET /api/reservations/:id` - Obter por ID (público)
- `PUT /api/reservations/:id/status` - Atualizar status (protegido - owner)
- `DELETE /api/reservations/:id` - Deletar (protegido - owner)

### Disponibilidade
- `GET /api/availability?restaurantId={id}&date={date}` - Obter slots (público)

### Webhooks
- `POST /api/webhook/calendar-update` - Receber atualizações do n8n
- `POST /api/webhook/sync-availability` - Sincronizar disponibilidade

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Proteção de rotas sensíveis
- Validação de dados
- CORS configurado

## 🎨 Customização

### Estilos
Edite `frontend/src/index.css` para personalizar cores, fontes e layouts.

### Duração padrão da reserva
Configurável por restaurante (padrão: 120 minutos)

### Horários de funcionamento
Configurável por dia da semana para cada restaurante

## 📱 Futuras Melhorias

- [ ] App mobile (React Native)
- [ ] Notificações push
- [ ] WhatsApp Business integration
- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Pagamento online
- [ ] Multi-idiomas
- [ ] Temas customizáveis

## 🐛 Troubleshooting

### Erro de conexão com MongoDB
```bash
# Verifique se o MongoDB está rodando
sudo systemctl status mongodb

# Ou inicie manualmente
mongod
```

### Erro de CORS
Verifique se o CORS está configurado corretamente no backend:
```javascript
app.use(cors());
```

### Token inválido
Limpe o localStorage do navegador e faça login novamente.

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Pietro Medeiros

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues e pull requests.

---

**Reserv.ai** - Simplificando reservas para restaurantes! 🍽️
