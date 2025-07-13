#!/bin/bash

# =============================================================================
# Script de Instalação Inicial do Servidor DigiUrban
# =============================================================================
# Este script configura o servidor VPS do zero para hospedar o DigiUrban
# Execute com: curl -fsSL https://raw.githubusercontent.com/seu-usuario/digiurban2/main/scripts/install-server.sh | bash
# =============================================================================

set -e

echo "🚀 Iniciando instalação do servidor DigiUrban..."

# Verificar se está rodando como root
if [[ $EUID -ne 0 ]]; then
   echo "❌ Este script deve ser executado como root"
   echo "💡 Execute: sudo bash install-server.sh"
   exit 1
fi

# =============================================================================
# 1. ATUALIZAÇÃO DO SISTEMA
# =============================================================================

echo "📦 Atualizando sistema..."
apt-get update -y
apt-get upgrade -y

# =============================================================================
# 2. INSTALAÇÃO DE DEPENDÊNCIAS BÁSICAS
# =============================================================================

echo "🔧 Instalando dependências básicas..."
apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    nano \
    htop \
    tree \
    build-essential

# =============================================================================
# 3. INSTALAÇÃO DO DOCKER
# =============================================================================

echo "🐳 Instalando Docker..."
if ! command -v docker &> /dev/null; then
    # Remover versões antigas
    apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Instalar Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    
    # Configurar Docker para iniciar automaticamente
    systemctl start docker
    systemctl enable docker
    
    # Adicionar usuário ao grupo docker
    usermod -aG docker $USER
    
    echo "✅ Docker instalado com sucesso!"
else
    echo "ℹ️  Docker já está instalado."
fi

# =============================================================================
# 4. INSTALAÇÃO DO DOCKER COMPOSE
# =============================================================================

echo "🐙 Instalando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    # Instalar Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Criar link simbólico
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    echo "✅ Docker Compose instalado com sucesso!"
else
    echo "ℹ️  Docker Compose já está instalado."
fi

# =============================================================================
# 5. INSTALAÇÃO DO NGINX
# =============================================================================

echo "🌐 Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    
    # Configurar Nginx para iniciar automaticamente
    systemctl start nginx
    systemctl enable nginx
    
    echo "✅ Nginx instalado com sucesso!"
else
    echo "ℹ️  Nginx já está instalado."
fi

# =============================================================================
# 6. INSTALAÇÃO DO CERTBOT (SSL)
# =============================================================================

echo "🔒 Instalando Certbot..."
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
    
    echo "✅ Certbot instalado com sucesso!"
else
    echo "ℹ️  Certbot já está instalado."
fi

# =============================================================================
# 7. INSTALAÇÃO DO FAIL2BAN (SEGURANÇA)
# =============================================================================

echo "🛡️  Instalando Fail2Ban..."
if ! command -v fail2ban-client &> /dev/null; then
    apt-get install -y fail2ban
    
    # Configurar Fail2Ban básico
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF
    
    systemctl start fail2ban
    systemctl enable fail2ban
    
    echo "✅ Fail2Ban instalado e configurado!"
else
    echo "ℹ️  Fail2Ban já está instalado."
fi

# =============================================================================
# 8. CONFIGURAÇÃO DO FIREWALL
# =============================================================================

echo "🔥 Configurando firewall..."
ufw --force enable
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5432/tcp
ufw allow 6379/tcp
ufw --force reload

echo "✅ Firewall configurado!"

# =============================================================================
# 9. CRIAÇÃO DO USUÁRIO DE DEPLOY
# =============================================================================

echo "👤 Criando usuário de deploy..."
if ! id "digiurban" &>/dev/null; then
    # Criar usuário
    useradd -m -s /bin/bash digiurban
    
    # Adicionar ao grupo sudo e docker
    usermod -aG sudo digiurban
    usermod -aG docker digiurban
    
    # Configurar sudo sem senha para deploy
    echo "digiurban ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers.d/digiurban
    
    echo "✅ Usuário 'digiurban' criado!"
else
    echo "ℹ️  Usuário 'digiurban' já existe."
fi

# =============================================================================
# 10. CRIAÇÃO DA ESTRUTURA DE DIRETÓRIOS
# =============================================================================

echo "📁 Criando estrutura de diretórios..."
mkdir -p /var/www/digiurban
mkdir -p /var/log/digiurban
mkdir -p /var/backups/digiurban

# Definir permissões corretas
chown -R digiurban:digiurban /var/www/digiurban
chown -R digiurban:digiurban /var/log/digiurban
chown -R digiurban:digiurban /var/backups/digiurban

echo "✅ Estrutura de diretórios criada!"

# =============================================================================
# 11. CONFIGURAÇÃO DE SWAP (se necessário)
# =============================================================================

echo "💾 Configurando swap..."
if ! swapon --show | grep -q "/swapfile"; then
    # Criar arquivo de swap de 2GB
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # Adicionar ao fstab para persistir após reinicialização
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    
    echo "✅ Swap de 2GB configurado!"
else
    echo "ℹ️  Swap já configurado."
fi

# =============================================================================
# 12. CONFIGURAÇÃO DE LIMITES DO SISTEMA
# =============================================================================

echo "⚙️  Configurando limites do sistema..."
cat >> /etc/security/limits.conf << EOF
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536
EOF

cat >> /etc/systemd/system.conf << EOF
DefaultLimitNOFILE=65536
DefaultLimitNPROC=65536
EOF

echo "✅ Limites do sistema configurados!"

# =============================================================================
# 13. CONFIGURAÇÃO DE LOGS
# =============================================================================

echo "📝 Configurando logs..."
# Configurar logrotate para logs da aplicação
cat > /etc/logrotate.d/digiurban << EOF
/var/log/digiurban/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 digiurban digiurban
    postrotate
        systemctl reload nginx
    endscript
}
EOF

echo "✅ Configuração de logs criada!"

# =============================================================================
# 14. INSTALAÇÃO DO NODE.JS (para ferramentas auxiliares)
# =============================================================================

echo "📦 Instalando Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    
    echo "✅ Node.js instalado!"
else
    echo "ℹ️  Node.js já está instalado."
fi

# =============================================================================
# 15. CONFIGURAÇÃO DE TIMEZONE
# =============================================================================

echo "🌍 Configurando timezone para São Paulo..."
timedatectl set-timezone America/Sao_Paulo

echo "✅ Timezone configurado!"

# =============================================================================
# 16. CONFIGURAÇÃO DE BACKUP AUTOMÁTICO
# =============================================================================

echo "💾 Configurando backup automático..."
# Criar script de backup
cat > /usr/local/bin/backup-digiurban.sh << 'EOF'
#!/bin/bash

# Configurações
BACKUP_DIR="/var/backups/digiurban"
APP_DIR="/var/www/digiurban"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco de dados
if docker ps | grep -q "digiurban_db"; then
    echo "Fazendo backup do banco de dados..."
    docker exec digiurban_db pg_dump -U digiurban digiurban_db > $BACKUP_DIR/db_backup_$DATE.sql
    gzip $BACKUP_DIR/db_backup_$DATE.sql
fi

# Backup dos arquivos de configuração
if [ -d "$APP_DIR" ]; then
    echo "Fazendo backup dos arquivos de configuração..."
    tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz -C $APP_DIR \
        docker-compose.yml \
        .env.production \
        nginx/ \
        scripts/ \
        2>/dev/null || true
fi

# Remover backups antigos
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup concluído: $DATE"
EOF

chmod +x /usr/local/bin/backup-digiurban.sh

# Adicionar ao cron (executar às 2h da manhã)
(crontab -u digiurban -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-digiurban.sh") | crontab -u digiurban -

echo "✅ Backup automático configurado!"

# =============================================================================
# 17. CONFIGURAÇÃO FINAL
# =============================================================================

echo "🔧 Configuração final..."

# Reiniciar serviços
systemctl restart docker
systemctl restart nginx
systemctl restart fail2ban

# Mostrar status dos serviços
echo "📊 Status dos serviços:"
systemctl is-active docker nginx fail2ban

# Mostrar informações do sistema
echo "📋 Informações do sistema:"
echo "• OS: $(lsb_release -d | cut -f2)"
echo "• Kernel: $(uname -r)"
echo "• Docker: $(docker --version)"
echo "• Docker Compose: $(docker-compose --version)"
echo "• Nginx: $(nginx -v 2>&1)"
echo "• Node.js: $(node --version)"
echo "• Timezone: $(timedatectl show --property=Timezone --value)"

# =============================================================================
# 18. INSTRUÇÕES FINAIS
# =============================================================================

echo ""
echo "🎉 ======================================"
echo "🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "🎉 ======================================"
echo ""
echo "📝 Próximos passos:"
echo "1. Configure as secrets no GitHub:"
echo "   - VPS_HOST: $(hostname -I | awk '{print $1}')"
echo "   - VPS_USER: digiurban"
echo "   - VPS_SSH_KEY: (chave SSH privada)"
echo "   - VPS_PORT: 22"
echo "   - DB_PASSWORD: (senha do PostgreSQL)"
echo "   - JWT_SECRET: (chave secreta JWT)"
echo "   - REDIS_PASSWORD: (senha do Redis)"
echo ""
echo "2. Aponte seu domínio para este IP: $(hostname -I | awk '{print $1}')"
echo ""
echo "3. Faça push para a branch main para iniciar o deploy automático"
echo ""
echo "4. Monitore o deploy em: https://github.com/seu-usuario/digiurban2/actions"
echo ""
echo "✅ Servidor pronto para receber o DigiUrban!"
echo "🌐 Acesse: https://www.digiurban.com.br (após o deploy)"
echo "" 