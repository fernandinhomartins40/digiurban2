#!/bin/bash

# Script para verificar configuração de secrets do GitHub
# Uso: ./scripts/check-secrets.sh

echo "🔍 Verificando configuração de secrets para deploy..."
echo ""

# Lista de secrets necessários
REQUIRED_SECRETS=(
    "VPS_HOST"
    "VPS_USER"
    "VPS_SSH_KEY" 
    "VPS_PORT"
    "DB_PASSWORD"
    "JWT_SECRET"
    "GITHUB_TOKEN"
)

echo "📋 Secrets necessários para o deploy:"
echo ""

for secret in "${REQUIRED_SECRETS[@]}"; do
    echo "🔑 $secret"
    case $secret in
        "VPS_HOST")
            echo "   📝 Exemplo: 192.168.1.100 ou meudominio.com"
            echo "   📍 IP ou domínio do seu VPS Hostinger"
            ;;
        "VPS_USER") 
            echo "   📝 Exemplo: root"
            echo "   👤 Usuário SSH (geralmente 'root')"
            ;;
        "VPS_SSH_KEY")
            echo "   📝 Chave SSH privada completa"
            echo "   🔐 Deve começar com -----BEGIN e terminar com -----END"
            echo "   ⚠️  Use a chave PRIVADA (não a .pub)"
            ;;
        "VPS_PORT")
            echo "   📝 Exemplo: 22"
            echo "   🚪 Porta SSH (padrão: 22)"
            ;;
        "DB_PASSWORD")
            echo "   📝 Senha segura do PostgreSQL"
            echo "   🗄️ Senha para o banco de dados"
            ;;
        "JWT_SECRET")
            echo "   📝 Chave muito longa e segura"
            echo "   🔒 Pelo menos 64 caracteres aleatórios"
            ;;
        "GITHUB_TOKEN")
            echo "   📝 Configurado automaticamente pelo GitHub"
            echo "   🤖 Token de acesso automático"
            ;;
    esac
    echo ""
done

echo "🔧 Como configurar:"
echo ""
echo "1. Acesse seu repositório no GitHub"
echo "2. Vá em: Settings → Secrets and variables → Actions"
echo "3. Clique em 'New repository secret'"
echo "4. Adicione cada secret com o nome exato listado acima"
echo ""

echo "🔑 Como gerar chave SSH:"
echo ""
echo "# No seu computador:"
echo "ssh-keygen -t ed25519 -C 'deploy@digiurban.com' -f ~/.ssh/digiurban_deploy"
echo ""
echo "# Copiar para o VPS:"
echo "ssh-copy-id -i ~/.ssh/digiurban_deploy.pub root@SEU_VPS_IP"
echo ""
echo "# Usar a chave PRIVADA no secret VPS_SSH_KEY:"
echo "cat ~/.ssh/digiurban_deploy"
echo ""

echo "🧪 Testar conexão SSH:"
echo ""
echo "ssh -i ~/.ssh/digiurban_deploy root@SEU_VPS_IP"
echo ""

echo "📚 Documentação completa:"
echo "📖 docs/SSH_SETUP.md"
echo ""

echo "✅ Após configurar todos os secrets, faça um push para testar o deploy!"