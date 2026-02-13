# ✅ Checklist de Instalação e Uso - Reserv.ai

## 📋 Pré-requisitos

- [ ] Node.js 16+ instalado
- [ ] npm instalado
- [ ] MongoDB instalado
- [ ] Git (opcional)

## 🚀 Instalação Rápida

### Opção 1: Script Automático (Recomendado)
```bash
./install.sh
```

### Opção 2: Manual
```bash
# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

## ⚙️ Configuração

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/reserv-ai
JWT_SECRET=sua_chave_secreta_aqui
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## ▶️ Iniciar Aplicação

### Opção 1: Script Automático
```bash
./start.sh
```

### Opção 2: Manual
```bash
# Terminal 1 - MongoDB (se necessário)
mongod

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - Frontend
cd frontend
npm start
```

## 🎯 Primeiro Uso - Checklist

### 1. Criar Conta Owner
- [ ] Acessar http://localhost:3000/register
- [ ] Preencher nome, email, telefone, senha
- [ ] Selecionar "Dono de Restaurante"
- [ ] Clicar em "Cadastrar"
- [ ] Verificar login automático

### 2. Cadastrar Restaurante
- [ ] Clicar em "Meus Restaurantes"
- [ ] Clicar em "Novo Restaurante"
- [ ] Preencher informações básicas:
  - [ ] Nome do restaurante
  - [ ] Descrição
  - [ ] Telefone
  - [ ] Email
- [ ] Preencher endereço:
  - [ ] Rua
  - [ ] Cidade
  - [ ] Estado
  - [ ] CEP
- [ ] Configurar:
  - [ ] Capacidade
  - [ ] Duração da reserva
  - [ ] Horários de funcionamento
  - [ ] Google Calendar ID (opcional)
- [ ] Clicar em "Salvar"

### 3. Testar Reserva Pública
- [ ] Copiar URL do restaurante
- [ ] Abrir em aba anônima ou fazer logout
- [ ] Preencher formulário de reserva:
  - [ ] Nome
  - [ ] Email
  - [ ] Telefone
  - [ ] Número de pessoas
  - [ ] Selecionar data
  - [ ] Escolher horário disponível
  - [ ] Adicionar observações (opcional)
- [ ] Confirmar reserva
- [ ] Verificar mensagem de sucesso

### 4. Gerenciar Reserva (Backoffice)
- [ ] Fazer login como owner
- [ ] Ir para "Reservas"
- [ ] Visualizar reserva criada
- [ ] Testar filtros:
  - [ ] Por restaurante
  - [ ] Por status
  - [ ] Por data
- [ ] Alterar status da reserva
- [ ] Verificar atualização

### 5. Dashboard
- [ ] Acessar Dashboard
- [ ] Verificar estatísticas:
  - [ ] Total de restaurantes
  - [ ] Total de reservas
  - [ ] Reservas pendentes
  - [ ] Reservas hoje
- [ ] Ver lista de reservas recentes

## 🔌 Configuração n8n (Opcional)

### Pré-requisitos n8n
- [ ] Conta n8n criada (cloud ou local)
- [ ] Google Cloud Project criado
- [ ] Google Calendar API habilitada
- [ ] OAuth2 Client ID e Secret obtidos

### Importar Workflows
- [ ] Importar `check-availability-workflow.json`
- [ ] Importar `create-event-workflow.json`
- [ ] Importar `cancel-event-workflow.json`

### Configurar Credenciais
- [ ] Adicionar Google OAuth2 no n8n
- [ ] Configurar Client ID e Secret
- [ ] Autorizar acesso ao Calendar
- [ ] Testar conexão

### Ativar Workflows
- [ ] Ativar workflow de disponibilidade
- [ ] Ativar workflow de criar evento
- [ ] Ativar workflow de cancelar evento
- [ ] Copiar URL do webhook
- [ ] Atualizar `N8N_WEBHOOK_URL` no backend

### Testar Integração
- [ ] Criar restaurante com Calendar ID
- [ ] Fazer reserva
- [ ] Verificar evento no Google Calendar
- [ ] Cancelar reserva
- [ ] Verificar cancelamento no Calendar

## 🧪 Testes Funcionais

### Autenticação
- [ ] Registrar novo usuário
- [ ] Login com credenciais corretas
- [ ] Login com credenciais incorretas (deve falhar)
- [ ] Acessar rota protegida sem login (deve redirecionar)
- [ ] Fazer logout

### Restaurantes (Owner)
- [ ] Criar restaurante
- [ ] Editar restaurante
- [ ] Listar restaurantes
- [ ] Desativar restaurante
- [ ] Tentar acessar como customer (deve ser negado)

### Reservas
- [ ] Criar reserva (público)
- [ ] Ver disponibilidade
- [ ] Atualizar status (owner)
- [ ] Filtrar reservas
- [ ] Deletar reserva

### Responsividade
- [ ] Testar em desktop
- [ ] Testar em tablet
- [ ] Testar em mobile
- [ ] Testar em diferentes navegadores

## 🐛 Troubleshooting

### MongoDB não conecta
- [ ] Verificar se mongod está rodando
- [ ] Verificar MONGODB_URI no .env
- [ ] Verificar porta 27017 livre

### Backend não inicia
- [ ] Verificar node_modules instalado
- [ ] Verificar arquivo .env existe
- [ ] Verificar porta 5000 livre
- [ ] Ver logs de erro

### Frontend não inicia
- [ ] Verificar node_modules instalado
- [ ] Verificar porta 3000 livre
- [ ] Limpar cache: `rm -rf node_modules package-lock.json && npm install`

### Erro de CORS
- [ ] Verificar backend está rodando
- [ ] Verificar REACT_APP_API_URL no frontend/.env
- [ ] Reiniciar ambos servidores

### Token inválido
- [ ] Limpar localStorage do navegador
- [ ] Fazer logout e login novamente
- [ ] Verificar JWT_SECRET no backend

## 📊 Métricas de Sucesso

### Instalação
- [ ] Backend rodando sem erros
- [ ] Frontend acessível no navegador
- [ ] MongoDB conectado
- [ ] Nenhum erro no console

### Funcionalidade
- [ ] Consegue criar conta
- [ ] Consegue fazer login
- [ ] Consegue cadastrar restaurante
- [ ] Consegue fazer reserva
- [ ] Consegue gerenciar reservas
- [ ] Dashboard mostra dados corretos

### Performance
- [ ] Páginas carregam em < 2s
- [ ] API responde em < 500ms
- [ ] Sem memory leaks
- [ ] Sem erros 500

## 🎓 Próximos Passos

### Desenvolvimento
- [ ] Customizar estilos CSS
- [ ] Adicionar logo personalizado
- [ ] Configurar email notifications
- [ ] Adicionar mais validações

### Produção
- [ ] Deploy backend (Heroku/AWS/DigitalOcean)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Configurar domínio
- [ ] Configurar HTTPS
- [ ] Configurar MongoDB Atlas
- [ ] Configurar backup

### Melhorias
- [ ] Adicionar testes automatizados
- [ ] Implementar CI/CD
- [ ] Adicionar analytics
- [ ] Implementar rate limiting
- [ ] Adicionar cache (Redis)

## ✅ Checklist Final

- [ ] Aplicação instalada e rodando
- [ ] Conta owner criada
- [ ] Pelo menos 1 restaurante cadastrado
- [ ] Pelo menos 1 reserva teste criada
- [ ] Dashboard funcionando
- [ ] Todas funcionalidades testadas
- [ ] Documentação lida
- [ ] Pronto para usar!

---

**Parabéns! 🎉** Se todos os itens estão marcados, sua aplicação Reserv.ai está 100% funcional!
