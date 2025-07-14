#!/bin/bash

# 🚀 Script de Setup VPS para DigiUrban
# Prepara o servidor para receber deploy automatizado via GitHub Actions

set -e

# Configurações
DOMAIN="www.digiurban.com.br"
APP_USER="digiurban"
APP_DIR="/opt/digiurban"
POSTGRES_VERSION="15"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[INFO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Verificar se está executando como root
if [[ $EUID -ne 0 ]]; then
   error "Este script deve ser executado como root"
fi

log "🚀 Iniciando setup do VPS para DigiUrban..."

# 1. Atualizar sistema
log "📦 Atualizando sistema..."
apt update -y && apt upgrade -y

# 2. Instalar dependências básicas
log "📦 Instalando dependências básicas..."
apt install -y curl wget git unzip htop nano ufw fail2ban

# 3. Configurar firewall
log "🔥 Configurando firewall..."
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable

# 4. Instalar Node.js 18
log "📦 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar instalação
node_version=$(node --version)
npm_version=$(npm --version)
log "✅ Node.js ${node_version} instalado"
log "✅ NPM ${npm_version} instalado"

# 5. Instalar PostgreSQL
log "🗄️ Instalando PostgreSQL ${POSTGRES_VERSION}..."
apt install -y postgresql postgresql-contrib

# Iniciar e habilitar PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# 6. Instalar PM2
log "📦 Instalando PM2..."
npm install -g pm2

# 7. Instalar TypeScript
log "📦 Instalando TypeScript..."
npm install -g typescript

# 8. Criar usuário para aplicação
log "👤 Criando usuário da aplicação..."
if ! id "$APP_USER" &>/dev/null; then
    useradd -m -s /bin/bash "$APP_USER"
    log "✅ Usuário $APP_USER criado"
else
    log "ℹ️ Usuário $APP_USER já existe"
fi

# 9. Criar estrutura de diretórios
log "📁 Criando estrutura de diretórios..."
mkdir -p "$APP_DIR"
mkdir -p "$APP_DIR/logs"
mkdir -p "$APP_DIR/backups"

# Definir permissões
chown -R "$APP_USER:$APP_USER" "$APP_DIR"
chmod -R 755 "$APP_DIR"

# 10. Configurar PostgreSQL
log "🔧 Configurando PostgreSQL..."

# Criar banco de dados e usuário
sudo -u postgres psql -c "CREATE DATABASE digiurban_db;" 2>/dev/null || log "ℹ️ Banco digiurban_db já existe"
sudo -u postgres psql -c "CREATE USER digiurban WITH PASSWORD 'changeme';" 2>/dev/null || log "ℹ️ Usuário digiurban já existe"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE digiurban_db TO digiurban;"
sudo -u postgres psql -c "ALTER USER digiurban CREATEDB;"

# 11. Configurar chaves SSH para deploy
log "🔑 Configurando chaves SSH para deploy..."
mkdir -p /root/.ssh
chmod 700 /root/.ssh

# Gerar chave SSH para GitHub Actions (se não existir)
if [ ! -f /root/.ssh/github_actions ]; then
    ssh-keygen -t ed25519 -C "github-actions@digiurban.com.br" -f /root/.ssh/github_actions -N ""
    cat /root/.ssh/github_actions.pub >> /root/.ssh/authorized_keys
    chmod 600 /root/.ssh/authorized_keys
    log "✅ Chave SSH para GitHub Actions criada"
    
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}🔑 CHAVE SSH PARA GITHUB ACTIONS:${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo -e "${YELLOW}Copie o conteúdo abaixo e cole na secret VPS_SSH_KEY do GitHub:${NC}"
    echo ""
    cat /root/.ssh/github_actions
    echo ""
    echo -e "${BLUE}========================================${NC}"
else
    log "ℹ️ Chave SSH para GitHub Actions já existe"
fi

# 12. Instalar Nginx (opcional)
log "📦 Instalando Nginx..."
apt install -y nginx

# Configurar Nginx básico
cat > /etc/nginx/sites-available/digiurban << 'EOF'
server {
    listen 80;
    server_name www.digiurban.com.br digiurban.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Habilitar site
ln -sf /etc/nginx/sites-available/digiurban /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t && systemctl reload nginx

# 13. Instalar Certbot para SSL (opcional)
log "🔒 Instalando Certbot para SSL..."
apt install -y certbot python3-certbot-nginx

# 14. Configurar PM2 startup
log "🔄 Configurando PM2 startup..."
pm2 startup systemd -u root --hp /root

# 15. Configurar logrotate
log "📋 Configurando logrotate..."
cat > /etc/logrotate.d/digiurban << 'EOF'
/opt/digiurban/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 digiurban digiurban
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# 16. Criar script de backup
log "💾 Criando script de backup..."
cat > /usr/local/bin/backup-digiurban.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/digiurban/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup do banco
sudo -u postgres pg_dump digiurban_db > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Backup dos arquivos
tar -czf "$BACKUP_DIR/files_backup_$TIMESTAMP.tar.gz" -C /opt/digiurban current

# Manter apenas os últimos 7 backups
find "$BACKUP_DIR" -name "*.sql" -type f -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +7 -delete

echo "Backup concluído: $TIMESTAMP"
EOF

chmod +x /usr/local/bin/backup-digiurban.sh

# 17. Configurar cron para backup
log "⏰ Configurando backup automático..."
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-digiurban.sh") | crontab -

# 18. Instalar monitoring tools
log "📊 Instalando ferramentas de monitoramento..."
apt install -y htop iotop nethogs

# 19. Configurar swapfile (se necessário)
if [ ! -f /swapfile ]; then
    log "💾 Criando swapfile..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log "✅ Swapfile de 2GB criado"
fi

# 20. Finalizar
log "🎉 Setup do VPS concluído com sucesso!"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ SETUP CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "  1. Configure as secrets no GitHub:"
echo -e "     - VPS_HOST: $(curl -s ifconfig.me)"
echo -e "     - VPS_USER: root"
echo -e "     - VPS_PORT: 22"
echo -e "     - VPS_SSH_KEY: (chave mostrada acima)"
echo -e "     - DB_PASSWORD: (defina uma senha forte)"
echo -e "     - JWT_SECRET: (defina uma chave secreta)"
echo ""
echo -e "  2. Configure o domínio para apontar para este IP: $(curl -s ifconfig.me)"
echo ""
echo -e "  3. Faça push para a branch main para iniciar o deploy"
echo ""
echo -e "  4. Após o deploy, configure SSL:"
echo -e "     sudo certbot --nginx -d www.digiurban.com.br"
echo ""
echo -e "${BLUE}🔗 URLs úteis:${NC}"
echo -e "  - Aplicação: http://$(curl -s ifconfig.me):3000"
echo -e "  - Aplicação (com domínio): http://www.digiurban.com.br"
echo -e "  - Logs: tail -f /opt/digiurban/logs/*.log"
echo -e "  - Status PM2: pm2 status"
echo -e "  - Backup: /usr/local/bin/backup-digiurban.sh"
echo ""
echo -e "${YELLOW}⚠️ Lembre-se de alterar as senhas padrão!${NC}"
echo -e "${GREEN}========================================${NC}" 