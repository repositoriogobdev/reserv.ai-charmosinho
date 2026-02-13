# 🚀 Guia Rápido de Início - Reserv.ai

Este guia te ajudará a ter a aplicação funcionando em poucos minutos!

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

**Backend** (`backend/.env`):
```bash
cp .env.example .env
# Edite o arquivo .env e configure:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reserv-ai
JWT_SECRET=mude_isso_para_algo_seguro_em_producao
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook
```

**Frontend** (`frontend/.env`):
```bash
cp .env.example .env
# O padrão já funciona para desenvolvimento local
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Iniciar MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Ou execute manualmente
mongod
```

### 4. Iniciar os Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

A aplicação abrirá automaticamente em `http://localhost:3000` 🎉

## 📝 Primeiro Uso

### 1. Criar Conta de Dono
1. Clique em "Cadastrar"
2. Preencha seus dados
3. Selecione **"Dono de Restaurante"**
4. Clique em "Cadastrar"

### 2. Adicionar Primeiro Restaurante
1. Vá em "Meus Restaurantes"
2. Clique em "Novo Restaurante"
3. Preencha:
   - Nome: "Meu Restaurante Teste"
   - Telefone: (11) 99999-9999
   - Endereço completo
   - Capacidade: 50
   - Horários de funcionamento (deixe os padrões)
4. Clique em "Salvar"

### 3. Testar Reserva
1. Copie o link de reserva do seu restaurante
2. Abra em uma aba anônima (ou faça logout)
3. Preencha o formulário de reserva
4. Selecione data e horário
5. Confirme a reserva

### 4. Ver Reserva no Backoffice
1. Faça login novamente
2. Vá em "Reservas"
3. Veja sua primeira reserva!
4. Experimente alterar o status

## 🔧 Configuração Opcional do n8n

### Opção 1: Usar n8n Cloud
1. Crie conta em [n8n.cloud](https://n8n.cloud)
2. Importe os workflows de `docs/n8n-workflows/`
3. Configure credenciais do Google Calendar
4. Copie a URL do webhook
5. Atualize `N8N_WEBHOOK_URL` no `.env` do backend

### Opção 2: n8n Local (Docker)
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Acesse http://localhost:5678
```

### Configurar Google Calendar
1. No n8n, vá em **Credentials** → **Create New**
2. Selecione **Google OAuth2 API**
3. Siga as instruções para obter Client ID e Secret
4. Importe os 3 workflows de `docs/n8n-workflows/`:
   - `check-availability-workflow.json`
   - `create-event-workflow.json`
   - `cancel-event-workflow.json`
5. Ative os workflows

## 🎯 Funcionalidades Principais

### Para Donos de Restaurante
- ✅ **Dashboard**: Visão geral com métricas
- ✅ **Meus Restaurantes**: Gerenciar estabelecimentos
- ✅ **Reservas**: Ver e gerenciar todas as reservas

### Para Clientes
- ✅ **Página Inicial**: Ver restaurantes disponíveis
- ✅ **Fazer Reserva**: Escolher data, hora e fazer reserva

## 📊 Dados de Teste

Você pode criar dados de teste rapidamente:

### Via Interface
1. Cadastre 2-3 restaurantes diferentes
2. Faça algumas reservas em cada um
3. Altere os status das reservas

### Via API (opcional)
```bash
# Criar usuário owner
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Owner",
    "email": "owner@teste.com",
    "password": "123456",
    "role": "owner",
    "phone": "(11) 99999-9999"
  }'

# Copie o token da resposta e use para criar restaurante
curl -X POST http://localhost:5000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Restaurante Teste API",
    "phone": "(11) 88888-8888",
    "capacity": 60,
    "address": {
      "street": "Rua Teste, 123",
      "city": "São Paulo",
      "state": "SP"
    }
  }'
```

## ❓ Problemas Comuns

### Erro: "Cannot connect to MongoDB"
```bash
# Inicie o MongoDB
mongod

# Ou no macOS com Homebrew
brew services start mongodb-community
```

### Erro: "Port 3000 already in use"
```bash
# Mate o processo usando a porta
lsof -ti:3000 | xargs kill -9

# Ou use outra porta
PORT=3001 npm start
```

### Erro: "Module not found"
```bash
# Delete node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro de CORS no frontend
- Verifique se o backend está rodando
- Confirme a URL no `.env` do frontend
- Reinicie ambos os servidores

## 📚 Próximos Passos

1. ✅ Explore todas as funcionalidades
2. 🔧 Configure o n8n para integração completa
3. 🎨 Customize os estilos em `frontend/src/index.css`
4. 📱 Teste em diferentes dispositivos
5. 🚀 Prepare para deploy (veja `docs/DEPLOYMENT.md`)

## 🆘 Precisa de Ajuda?

- 📖 Leia o [README.md](../README.md) completo
- 🔌 Veja [N8N_INTEGRATION.md](N8N_INTEGRATION.md) para webhooks
- 🐛 Abra uma issue no repositório

---

**Dica**: Mantenha os dois terminais (backend e frontend) abertos enquanto desenvolve!
