#!/bin/bash

echo "🚀 Reserv.ai - Script de Instalação"
echo "===================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 16+ primeiro."
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale npm primeiro."
    exit 1
fi

echo "✅ npm $(npm -v) encontrado"

# Verificar MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB não encontrado. Por favor, instale MongoDB."
    echo "macOS: brew install mongodb-community"
    echo "Ubuntu: sudo apt-get install mongodb"
    read -p "Continuar mesmo assim? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MongoDB encontrado"
fi

echo ""
echo "📦 Instalando dependências do Backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do backend"
    exit 1
fi
echo "✅ Backend instalado com sucesso"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo ""
    echo "📝 Criando arquivo .env do backend..."
    cp .env.example .env
    echo "✅ Arquivo .env criado"
    echo "⚠️  Lembre-se de editar backend/.env com suas configurações!"
fi

echo ""
echo "📦 Instalando dependências do Frontend..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do frontend"
    exit 1
fi
echo "✅ Frontend instalado com sucesso"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo ""
    echo "📝 Criando arquivo .env do frontend..."
    cp .env.example .env
    echo "✅ Arquivo .env criado"
fi

cd ..

echo ""
echo "✅ Instalação concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Certifique-se que o MongoDB está rodando"
echo "2. Edite backend/.env com suas configurações"
echo "3. Execute: ./start.sh (ou inicie manualmente)"
echo ""
echo "Para iniciar manualmente:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm start"
echo ""
