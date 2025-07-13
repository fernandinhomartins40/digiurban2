#!/bin/bash

# Script de setup inicial para VPS Hostinger
# Execute este script na primeira configuração do servidor

set -e

# Configurações
DOMAIN="your-domain.com"
EMAIL="your-email@example.com"
APP_DIR="/var/www/digiurban"
USER="digiurban"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Atualizar sistema
update_system() {
    log "Atualizando sistema..."
    apt update && apt upgrade -y
    apt install -y curl wget git vim htop ufw fail2ban
}

# Configurar firewall
setup_firewall() {
    log "Configurando firewall..."
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
}

# Instalar Docker
install_docker() {
    log "Instalando Docker..."
    
    # Remover versões antigas
    apt remove -y docker docker-engine docker.io containerd runc || true
    
    # Instalar dependências
    apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Adicionar chave GPG
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Adicionar repositório
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Instalar Docker
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Instalar Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Adicionar usuário ao grupo docker
    usermod -aG docker $USER
    
    # Habilitar Docker no boot
    systemctl enable docker
    systemctl start docker
}

# Criar usuário para aplicação
create_user() {
    log "Criando usuário para aplicação..."
    
    if ! id "$USER" &>/dev/null; then
        useradd -m -s /bin/bash "$USER"
        usermod -aG docker "$USER"
        usermod -aG sudo "$USER"
        
        # Configurar SSH para o usuário
        mkdir -p /home/$USER/.ssh
        cp /root/.ssh/authorized_keys /home/$USER/.ssh/
        chown -R $USER:$USER /home/$USER/.ssh
        chmod 700 /home/$USER/.ssh
        chmod 600 /home/$USER/.ssh/authorized_keys
        
        log "Usuário $USER criado com sucesso"
    else
        warning "Usuário $USER já existe"
    fi
}

# Configurar diretórios
setup_directories() {
    log "Configurando diretórios..."
    
    mkdir -p "$APP_DIR"
    mkdir -p "$APP_DIR/logs"
    mkdir -p "$APP_DIR/backups"
    mkdir -p "$APP_DIR/uploads"
    mkdir -p "$APP_DIR/nginx"
    mkdir -p "$APP_DIR/certbot/conf"
    mkdir -p "$APP_DIR/certbot/www"
    
    chown -R $USER:$USER "$APP_DIR"
    chmod -R 755 "$APP_DIR"
}

# Clonar repositório
clone_repository() {
    log "Clonando repositório..."
    
    if [ ! -d "$APP_DIR/.git" ]; then
        info "Digite a URL do repositório Git:"
        read -r REPO_URL
        
        su - $USER -c "git clone $REPO_URL $APP_DIR"
        
        # Copiar arquivo de ambiente
        cp "$APP_DIR/.env.production" "$APP_DIR/.env"
        
        log "Repositório clonado com sucesso"
    else
        warning "Repositório já existe"
    fi
}

# Configurar SSL
setup_ssl() {
    log "Configurando SSL com Let's Encrypt..."
    
    # Criar configuração temporária do Nginx
    cat > /tmp/nginx-temp.conf << EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
    
    # Iniciar Nginx temporário
    docker run --rm -d \
        --name nginx-temp \
        -p 80:80 \
        -v /tmp/nginx-temp.conf:/etc/nginx/conf.d/default.conf \
        -v "$APP_DIR/certbot/www:/var/www/certbot" \
        nginx:alpine
    
    # Obter certificado SSL
    docker run --rm \
        -v "$APP_DIR/certbot/conf:/etc/letsencrypt" \
        -v "$APP_DIR/certbot/www:/var/www/certbot" \
        certbot/certbot \
        certonly --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN"
    
    # Parar Nginx temporário
    docker stop nginx-temp
    
    log "SSL configurado com sucesso"
}

# Configurar cron para renovação SSL
setup_ssl_renewal() {
    log "Configurando renovação automática do SSL..."
    
    # Criar script de renovação
    cat > /usr/local/bin/renew-ssl.sh << 'EOF'
#!/bin/bash
cd /var/www/digiurban
docker-compose exec certbot certbot renew --quiet
docker-compose exec nginx nginx -s reload
EOF
    
    chmod +x /usr/local/bin/renew-ssl.sh
    
    # Adicionar ao cron
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/local/bin/renew-ssl.sh") | crontab -
    
    log "Renovação automática do SSL configurada"
}

# Configurar monitoramento
setup_monitoring() {
    log "Configurando monitoramento básico..."
    
    # Instalar htop e outros utilitários
    apt install -y htop iotop nethogs ncdu
    
    # Configurar logrotate
    cat > /etc/logrotate.d/digiurban << EOF
$APP_DIR/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 $USER $USER
}
EOF
    
    log "Monitoramento configurado"
}

# Configurar backup automático
setup_backup() {
    log "Configurando backup automático..."
    
    # Criar script de backup
    cat > /usr/local/bin/backup-digiurban.sh << EOF
#!/bin/bash
cd $APP_DIR
docker exec digiurban_db pg_dump -U digiurban digiurban_db > backups/backup_\$(date +%Y%m%d_%H%M%S).sql
find backups/ -name "backup_*.sql" -type f -mtime +7 -delete
EOF
    
    chmod +x /usr/local/bin/backup-digiurban.sh
    
    # Adicionar ao cron (backup diário às 2:00)
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-digiurban.sh") | crontab -
    
    log "Backup automático configurado"
}

# Função principal
main() {
    log "Iniciando setup do VPS para DigiUrban..."
    
    # Verificar se está rodando como root
    if [ "$EUID" -ne 0 ]; then
        error "Execute este script como root"
    fi
    
    # Solicitar informações
    read -p "Digite o domínio (ex: exemplo.com): " DOMAIN
    read -p "Digite o email para SSL: " EMAIL
    
    # Executar setup
    update_system
    setup_firewall
    install_docker
    create_user
    setup_directories
    clone_repository
    setup_ssl
    setup_ssl_renewal
    setup_monitoring
    setup_backup
    
    log "Setup concluído com sucesso!"
    
    info "Próximos passos:"
    info "1. Configure as variáveis de ambiente em $APP_DIR/.env"
    info "2. Ajuste a configuração do Nginx em $APP_DIR/nginx/conf.d/digiurban.conf"
    info "3. Execute o deploy: su - $USER -c 'cd $APP_DIR && ./scripts/deploy.sh production'"
    info "4. Configure os secrets do GitHub Actions no repositório"
    
    warning "Importante: Reinicie o servidor para aplicar todas as configurações!"
}

# Executar
main "$@" 