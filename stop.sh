#!/bin/bash

echo "🛑 Parando Reserv.ai..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Parar processos na porta 5000 (backend)
if lsof -ti:5000 > /dev/null 2>&1; then
    echo "🔴 Parando Backend (porta 5000)..."
    kill -9 $(lsof -ti:5000)
    echo -e "${GREEN}✅ Backend parado${NC}"
else
    echo "ℹ️  Backend não estava rodando"
fi

# Parar processos na porta 3000 (frontend)
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "🔴 Parando Frontend (porta 3000)..."
    kill -9 $(lsof -ti:3000)
    echo -e "${GREEN}✅ Frontend parado${NC}"
else
    echo "ℹ️  Frontend não estava rodando"
fi

# Parar processos node relacionados
pkill -f "node.*backend" 2>/dev/null
pkill -f "node.*frontend" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null

echo ""
echo -e "${GREEN}✅ Todos os processos foram encerrados${NC}"
