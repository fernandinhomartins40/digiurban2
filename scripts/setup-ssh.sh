#!/bin/bash

# 🔐 Script para Configurar SSH para GitHub Actions Deploy
# Execute este script na sua VPS

set -e

echo "🔐 Configurando SSH para GitHub Actions Deploy..."

# Verificar se está executando como root
if [[ $EUID -ne 0 ]]; then
   echo "❌ Este script deve ser executado como root"
   exit 1
fi

# Obter IP da VPS
VPS_IP=$(curl -s ifconfig.me)
echo "🌐 IP da VPS: $VPS_IP"

# Criar diretório SSH se não existir
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Gerar chave SSH para GitHub Actions
echo "🔑 Gerando chave SSH para GitHub Actions..."
ssh-keygen -t ed25519 -C "github-actions@digiurban.com.br" -f ~/.ssh/github_actions -N ""

# Adicionar chave pública ao authorized_keys
echo "📝 Adicionando chave ao authorized_keys..."
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Definir permissões corretas
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github_actions
chmod 644 ~/.ssh/github_actions.pub

echo "✅ SSH configurado com sucesso!"

# Mostrar informações para o usuário
echo ""
echo "========================================="
echo "🔐 CONFIGURAÇÃO DAS SECRETS NO GITHUB"
echo "========================================="
echo ""
echo "Configure as seguintes secrets no GitHub:"
echo "Settings → Secrets and variables → Actions"
echo ""
echo "1. VPS_HOST:"
echo "   $VPS_IP"
echo ""
echo "2. VPS_USER:"
echo "   root"
echo ""
echo "3. VPS_PORT:"
echo "   22"
echo ""
echo "4. VPS_SSH_KEY:"
echo "   (copie o conteúdo abaixo - TUDO, incluindo BEGIN/END)"
echo ""
echo "----------------------------------------"
cat ~/.ssh/github_actions
echo "----------------------------------------"
echo ""
echo "5. DB_PASSWORD:"
echo "   (defina uma senha forte, ex: MinhaSenh@123!)"
echo ""
echo "6. JWT_SECRET:"
echo "   (defina uma chave secreta longa)"
echo ""
echo "========================================="
echo "🧪 TESTE DE CONECTIVIDADE"
echo "========================================="
echo ""
echo "Para testar se funcionou, execute no seu computador:"
echo "ssh -i ~/.ssh/github_actions root@$VPS_IP"
echo ""
echo "Se a conexão funcionar, a configuração está correta!"
echo ""
echo "========================================="
echo "🚀 PRÓXIMOS PASSOS"
echo "========================================="
echo ""
echo "1. Copie a chave SSH acima e configure no GitHub"
echo "2. Configure as outras secrets necessárias"
echo "3. Faça push para main para testar o deploy"
echo "4. Acompanhe o workflow no GitHub Actions"
echo ""
echo "✅ Configuração SSH completa!" 