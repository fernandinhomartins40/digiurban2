#!/bin/bash

# Script de deploy para VPS Hostinger usando systemd
# Uso: ./scripts/deploy-systemd.sh [production|staging]

set -e

# Configurações
ENVIRONMENT=${1:-production}
APP_NAME="digiurban"
APP_DIR="/opt/digiurban"
SERVICE_NAME="digiurban.service"
BACKUP_DIR="$APP_DIR/backups"
LOG_FILE="$APP_DIR/logs/deploy.log"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    echo "[ERROR] $1" >> "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
    echo "[WARNING] $1" >> "$LOG_FILE"
}

# Verificar se Node.js está instalado
check_nodejs() {
    if ! command -v node &> /dev/null; then
        error "Node.js não está instalado"
    fi
    
    if ! command -v npm &> /dev/null; then
        error "NPM não está instalado"
    fi
    
    log "Node.js $(node --version) e NPM $(npm --version) detectados"
}

# Criar usuário digiurban se não existir
create_user() {
    if ! id "digiurban" &>/dev/null; then
        log "Criando usuário digiurban..."
        useradd -r -s /bin/bash -d /opt/digiurban -c "DigiUrban Application" digiurban
    fi
}

# Criar backup do banco de dados
create_backup() {
    log "Criando backup do banco de dados..."
    
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if sudo -u postgres pg_dump digiurban_db > "$BACKUP_FILE"; then
        log "Backup criado: $BACKUP_FILE"
        
        # Manter apenas os últimos 7 backups
        find "$BACKUP_DIR" -name "backup_*.sql" -type f -mtime +7 -delete
    else
        warning "Falha ao criar backup do banco de dados"
    fi
}

# Parar o serviço
stop_service() {
    log "Parando serviço DigiUrban..."
    if systemctl is-active --quiet $SERVICE_NAME; then
        systemctl stop $SERVICE_NAME
        log "Serviço parado com sucesso"
    else
        log "Serviço não estava rodando"
    fi
}

# Instalar dependências e fazer build
build_application() {
    log "Instalando dependências..."
    cd "$APP_DIR/current"
    
    # Limpar cache do npm
    npm cache clean --force
    
    # Instalar dependências
    npm ci --silent --production=false
    
    log "Fazendo build da aplicação..."
    npm run build
    
    # Verificar se o build foi bem-sucedido
    if [ ! -f "dist-server/server/index.js" ]; then
        error "Build falhou - arquivo principal não encontrado"
    fi
    
    # Copiar frontend para backend
    mkdir -p dist-server/public
    cp -r dist/* dist-server/public/
    
    log "Build concluído com sucesso"
}

# Configurar systemd service
setup_systemd() {
    log "Configurando serviço systemd..."
    
    # Copiar arquivo de serviço
    cp "$APP_DIR/current/systemd/digiurban.service" "/etc/systemd/system/"
    
    # Recarregar systemd
    systemctl daemon-reload
    
    # Habilitar serviço para iniciar no boot
    systemctl enable $SERVICE_NAME
    
    log "Serviço systemd configurado"
}

# Iniciar o serviço
start_service() {
    log "Iniciando serviço DigiUrban..."
    
    systemctl start $SERVICE_NAME
    
    # Aguardar um pouco para o serviço inicializar
    sleep 10
    
    # Verificar status
    if systemctl is-active --quiet $SERVICE_NAME; then
        log "Serviço iniciado com sucesso"
    else
        error "Falha ao iniciar o serviço"
    fi
}

# Verificar se a aplicação está funcionando
health_check() {
    local url="http://localhost:3003/api/health"
    local max_attempts=30
    local attempt=0
    
    log "Verificando saúde da aplicação..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f "$url" &> /dev/null; then
            log "Aplicação está respondendo!"
            return 0
        fi
        
        ((attempt++))
        sleep 5
    done
    
    error "Aplicação não está respondendo após $max_attempts tentativas"
}

# Mostrar status do serviço
show_status() {
    log "Status do serviço:"
    systemctl status $SERVICE_NAME --no-pager -l
    
    log "Logs recentes:"
    journalctl -u $SERVICE_NAME --no-pager -l -n 20
}

# Deploy principal
deploy() {
    log "Iniciando deploy do DigiUrban - Ambiente: $ENVIRONMENT"
    
    # Verificar dependências
    check_nodejs
    
    # Criar usuário
    create_user
    
    # Criar diretórios necessários
    mkdir -p "$APP_DIR/logs" "$APP_DIR/uploads" "$BACKUP_DIR"
    
    # Navegar para diretório da aplicação
    cd "$APP_DIR" || error "Diretório da aplicação não encontrado: $APP_DIR"
    
    # Fazer backup
    create_backup
    
    # Parar serviço atual
    stop_service
    
    # Atualizar código
    log "Atualizando código fonte..."
    if [ -d "current" ]; then
        cd current
        git pull origin main || error "Falha ao atualizar código fonte"
        cd ..
    else
        error "Diretório current não encontrado"
    fi
    
    # Build da aplicação
    build_application
    
    # Configurar permissões
    log "Configurando permissões..."
    chown -R digiurban:digiurban "$APP_DIR"
    chmod -R 755 "$APP_DIR"
    
    # Configurar systemd
    setup_systemd
    
    # Iniciar serviço
    start_service
    
    # Verificar saúde da aplicação
    health_check
    
    # Mostrar status
    show_status
    
    log "Deploy concluído com sucesso!"
}

# Rollback
rollback() {
    log "Iniciando rollback..."
    
    cd "$APP_DIR/current" || error "Diretório da aplicação não encontrado: $APP_DIR/current"
    
    # Parar serviço
    stop_service
    
    # Reverter para commit anterior
    git reset --hard HEAD~1
    
    # Rebuild
    build_application
    
    # Configurar permissões
    chown -R digiurban:digiurban "$APP_DIR"
    
    # Iniciar serviço
    start_service
    
    # Verificar saúde
    health_check
    
    log "Rollback concluído com sucesso!"
}

# Função principal
main() {
    case "$1" in
        "production"|"staging")
            deploy
            ;;
        "rollback")
            rollback
            ;;
        "status")
            show_status
            ;;
        *)
            echo "Uso: $0 [production|staging|rollback|status]"
            exit 1
            ;;
    esac
}

# Executar
main "$@"