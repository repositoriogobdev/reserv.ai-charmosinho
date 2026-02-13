#!/bin/bash

echo "🚀 Iniciando Reserv.ai..."
echo "========================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se MongoDB está rodando
echo "🔍 Verificando MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB não está rodando${NC}"
    echo "Tentando iniciar MongoDB..."
    
    # Tentar iniciar no macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb-community 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ MongoDB iniciado${NC}"
        fi
    else
        # Tentar iniciar no Linux
        sudo systemctl start mongodb 2>/dev/null || sudo service mongodb start 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ MongoDB iniciado${NC}"
        fi
    fi
    
    sleep 2
fi

# Verificar novamente
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB está rodando${NC}"
else
    echo -e "${RED}❌ Não foi possível iniciar MongoDB automaticamente${NC}"
    echo "Por favor, inicie manualmente: mongod"
    read -p "Pressione Enter quando o MongoDB estiver rodando..."
fi

echo ""
echo "🔧 Iniciando Backend..."

# Criar arquivo de log temporário
BACKEND_LOG=$(mktemp)
FRONTEND_LOG=$(mktemp)

# Iniciar backend em background
cd backend
npm run dev > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar backend iniciar
echo "⏳ Aguardando backend iniciar..."
for i in {1..10}; do
    if grep -q "Servidor rodando" "$BACKEND_LOG" 2>/dev/null; then
        echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
        break
    fi
    sleep 1
done

echo ""
echo "🎨 Iniciando Frontend..."

# Iniciar frontend em background
cd frontend
npm start > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
cd ..

# Aguardar frontend iniciar
echo "⏳ Aguardando frontend iniciar..."
for i in {1..15}; do
    if lsof -ti:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
        break
    fi
    sleep 1
done

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Reserv.ai está rodando!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "🌐 Acesse: http://localhost:3000"
echo "📡 API Backend: http://localhost:5000"
echo ""
echo "📋 Processos:"
echo "  Backend PID: $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "Para parar os servidores:"
echo "  ctrl+c ou execute: ./stop.sh"
echo ""
echo "📝 Logs salvos em:"
echo "  Backend: $BACKEND_LOG"
echo "  Frontend: $FRONTEND_LOG"
echo ""

# Função para cleanup ao sair
cleanup() {
    echo ""
    echo "🛑 Encerrando servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "👋 Até logo!"
    exit 0
}

# Capturar ctrl+c
trap cleanup SIGINT SIGTERM

# Mostrar logs em tempo real
echo "📄 Mostrando logs (ctrl+c para sair)..."
echo ""
tail -f "$BACKEND_LOG" "$FRONTEND_LOG" &
TAIL_PID=$!

# Aguardar
wait $BACKEND_PID $FRONTEND_PID
