#!/bin/bash
# Script para configurar variáveis de ambiente no Vercel
# Execute: chmod +x setup-vercel-env.sh && ./setup-vercel-env.sh

echo "🔧 Configurando variáveis de ambiente no Vercel..."
echo ""

# Carregar .env
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Copie .env.example para .env e preencha as credenciais"
    exit 1
fi

source .env

echo "Adicionando FIREBASE_API_KEY..."
echo "$FIREBASE_API_KEY" | vercel env add FIREBASE_API_KEY production

echo "Adicionando FIREBASE_AUTH_DOMAIN..."
echo "$FIREBASE_AUTH_DOMAIN" | vercel env add FIREBASE_AUTH_DOMAIN production

echo "Adicionando FIREBASE_PROJECT_ID..."
echo "$FIREBASE_PROJECT_ID" | vercel env add FIREBASE_PROJECT_ID production

echo "Adicionando FIREBASE_STORAGE_BUCKET..."
echo "$FIREBASE_STORAGE_BUCKET" | vercel env add FIREBASE_STORAGE_BUCKET production

echo "Adicionando FIREBASE_MESSAGING_SENDER_ID..."
echo "$FIREBASE_MESSAGING_SENDER_ID" | vercel env add FIREBASE_MESSAGING_SENDER_ID production

echo "Adicionando FIREBASE_APP_ID..."
echo "$FIREBASE_APP_ID" | vercel env add FIREBASE_APP_ID production

echo "Adicionando FIREBASE_MEASUREMENT_ID..."
echo "$FIREBASE_MEASUREMENT_ID" | vercel env add FIREBASE_MEASUREMENT_ID production

echo ""
echo "✅ Variáveis configuradas!"
echo ""
echo "Agora execute: vercel --prod"
