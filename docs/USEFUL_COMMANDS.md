# 🛠️ Comandos Úteis - Reserv.ai

Referência rápida de comandos úteis para trabalhar com o projeto.

## 📦 Instalação e Setup

### Instalar tudo automaticamente
```bash
./install.sh
```

### Instalar manualmente

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## ▶️ Executar Aplicação

### Iniciar tudo automaticamente
```bash
./start.sh
```

### Parar tudo
```bash
./stop.sh
```

### Iniciar separadamente

**MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Manual
mongod
```

**Backend (development):**
```bash
cd backend
npm run dev
```

**Backend (production):**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm start
```

## 🗄️ MongoDB

### Iniciar MongoDB
```bash
mongod
```

### Conectar ao MongoDB
```bash
mongo
# ou
mongosh
```

### Ver databases
```javascript
show dbs
```

### Usar database do projeto
```javascript
use reserv-ai
```

### Ver collections
```javascript
show collections
```

### Ver todos os usuários
```javascript
db.users.find().pretty()
```

### Ver todos os restaurantes
```javascript
db.restaurants.find().pretty()
```

### Ver todas as reservas
```javascript
db.reservations.find().pretty()
```

### Limpar todas as reservas
```javascript
db.reservations.deleteMany({})
```

### Limpar todos os dados
```javascript
db.users.deleteMany({})
db.restaurants.deleteMany({})
db.reservations.deleteMany({})
```

### Backup do banco
```bash
mongodump --db reserv-ai --out ./backup
```

### Restaurar backup
```bash
mongorestore --db reserv-ai ./backup/reserv-ai
```

## 🧹 Limpeza

### Limpar node_modules

**Backend:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Ambos:**
```bash
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name "package-lock.json" -delete
cd backend && npm install && cd ../frontend && npm install
```

### Limpar cache do npm
```bash
npm cache clean --force
```

### Limpar build do frontend
```bash
cd frontend
rm -rf build
```

## 🔍 Debug e Logs

### Ver logs do MongoDB
```bash
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Ver processos rodando nas portas
```bash
# Porta 5000 (backend)
lsof -i :5000

# Porta 3000 (frontend)
lsof -i :3000

# Porta 27017 (MongoDB)
lsof -i :27017
```

### Matar processo em porta específica
```bash
# Porta 5000
kill -9 $(lsof -ti:5000)

# Porta 3000
kill -9 $(lsof -ti:3000)
```

### Ver logs em tempo real

**Backend:**
```bash
cd backend
npm run dev | tee backend.log
```

**Frontend:**
```bash
cd frontend
npm start 2>&1 | tee frontend.log
```

## 🧪 Testes

### Testar API com curl

**Registrar usuário:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "123456",
    "role": "owner",
    "phone": "(11) 99999-9999"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "123456"
  }'
```

**Listar restaurantes (público):**
```bash
curl http://localhost:5000/api/restaurants
```

**Criar restaurante (precisa token):**
```bash
curl -X POST http://localhost:5000/api/restaurants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Restaurante Teste",
    "phone": "(11) 88888-8888",
    "capacity": 60,
    "address": {
      "street": "Rua Teste, 123",
      "city": "São Paulo",
      "state": "SP"
    }
  }'
```

**Verificar disponibilidade:**
```bash
curl "http://localhost:5000/api/availability?restaurantId=RESTAURANT_ID&date=2026-02-15"
```

## 🔧 Manutenção

### Atualizar dependências

**Backend:**
```bash
cd backend
npm update
npm audit fix
```

**Frontend:**
```bash
cd frontend
npm update
npm audit fix
```

### Verificar vulnerabilidades
```bash
npm audit
```

### Corrigir vulnerabilidades automaticamente
```bash
npm audit fix
```

### Build de produção

**Frontend:**
```bash
cd frontend
npm run build
```

**Testar build localmente:**
```bash
cd frontend
npm install -g serve
serve -s build
```

## 📊 Informações do Sistema

### Versão do Node.js
```bash
node -v
```

### Versão do npm
```bash
npm -v
```

### Versão do MongoDB
```bash
mongod --version
```

### Espaço em disco
```bash
df -h
```

### Memória
```bash
free -h  # Linux
vm_stat  # macOS
```

### Processos Node.js rodando
```bash
ps aux | grep node
```

## 🌐 Rede

### Verificar portas em uso
```bash
netstat -an | grep LISTEN
```

### Testar conectividade com MongoDB
```bash
nc -zv localhost 27017
```

### Testar conectividade com Backend
```bash
curl http://localhost:5000
```

### Testar conectividade com Frontend
```bash
curl http://localhost:3000
```

## 🔐 Segurança

### Gerar novo JWT_SECRET
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Ver variáveis de ambiente (sem valores sensíveis)
```bash
cd backend
cat .env.example
```

## 📝 Git (Controle de Versão)

### Inicializar repositório
```bash
git init
git add .
git commit -m "Initial commit: Reserv.ai full stack application"
```

### Criar .gitignore (se não existir)
```bash
echo "node_modules/
.env
*.log
.DS_Store" > .gitignore
```

### Ver status
```bash
git status
```

### Commit
```bash
git add .
git commit -m "Sua mensagem aqui"
```

### Criar branch
```bash
git checkout -b nova-feature
```

## 🚀 Deploy

### Preparar para deploy

**Backend:**
```bash
cd backend
# Atualizar package.json com script de start
# Configurar variáveis de ambiente no serviço de hosting
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy da pasta build/
```

### Variáveis de ambiente para produção

**Backend:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/reserv-ai
JWT_SECRET=chave_super_segura_gerada_aleatoriamente
N8N_WEBHOOK_URL=https://seu-n8n-prod.com/webhook
NODE_ENV=production
```

**Frontend:**
```env
REACT_APP_API_URL=https://seu-backend-prod.com/api
```

## ⚡ Performance

### Analisar bundle do frontend
```bash
cd frontend
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Medir tempo de resposta da API
```bash
curl -w "@-" -o /dev/null -s http://localhost:5000/api/restaurants <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

## 🆘 Ajuda

### Ver logs de erro do npm
```bash
npm config get cache
# Logs em: ~/.npm/_logs/
```

### Reinstalar tudo do zero
```bash
./stop.sh
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
./install.sh
```

### Reset completo (incluindo database)
```bash
./stop.sh
mongo reserv-ai --eval "db.dropDatabase()"
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
./install.sh
./start.sh
```

---

💡 **Dica**: Adicione estes comandos aos seus aliases do shell para acesso rápido!

```bash
# Adicione ao ~/.zshrc ou ~/.bashrc
alias reservai-start='cd /caminho/para/reserv.ai && ./start.sh'
alias reservai-stop='cd /caminho/para/reserv.ai && ./stop.sh'
alias reservai-logs='cd /caminho/para/reserv.ai && tail -f backend.log frontend.log'
```
