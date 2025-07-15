#!/bin/bash

# Script de deploy para VPS Hostinger
# Uso: ./scripts/deploy.sh [production|staging]

set -e

# Configurações
ENVIRONMENT=${1:-production}
APP_NAME="digiurban"
APP_DIR="/var/www/digiurban"
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

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado"
    fi
}

# Criar backup do banco de dados
create_backup() {
    log "Criando backup do banco de dados..."
    
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if docker exec digiurban_db pg_dump -U digiurban digiurban_db > "$BACKUP_FILE"; then
        log "Backup criado: $BACKUP_FILE"
        
        # Manter apenas os últimos 7 backups
        find "$BACKUP_DIR" -name "backup_*.sql" -type f -mtime +7 -delete
    else
        warning "Falha ao criar backup do banco de dados"
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

# Deploy principal
deploy() {
    log "Iniciando deploy do DigiUrban - Ambiente: $ENVIRONMENT"
    
    # Verificar dependências
    check_docker
    
    # Navegar para diretório da aplicação
    cd "$APP_DIR" || error "Diretório da aplicação não encontrado: $APP_DIR"
    
    # Fazer backup
    create_backup
    
    # Atualizar código
    log "Atualizando código fonte..."
    git pull origin main || error "Falha ao atualizar código fonte"
    
    # Parar containers antigos
    log "Parando containers antigos..."
    docker-compose down || warning "Falha ao parar containers"
    
    # Remover imagens antigas
    log "Removendo imagens antigas..."
    docker image prune -f
    
    # Fazer build da nova imagem
    log "Fazendo build da nova imagem..."
    docker-compose build --no-cache
    
    # Subir novos containers
    log "Subindo novos containers..."
    docker-compose up -d || error "Falha ao subir containers"
    
    # Aguardar containers ficarem prontos
    log "Aguardando containers ficarem prontos..."
    sleep 30
    
    # Executar migrations se necessário
    log "Executando migrations..."
    docker exec digiurban_app npm run migrate --if-present || warning "Falha ao executar migrations"
    
    # Verificar saúde da aplicação
    health_check
    
    # Limpar sistema
    log "Limpando sistema..."
    docker system prune -f
    
    log "Deploy concluído com sucesso!"
}

# Rollback
rollback() {
    log "Iniciando rollback..."
    
    cd "$APP_DIR" || error "Diretório da aplicação não encontrado: $APP_DIR"
    
    # Reverter para commit anterior
    git reset --hard HEAD~1
    
    # Parar containers
    docker-compose down
    
    # Fazer build e subir
    docker-compose build --no-cache
    docker-compose up -d
    
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
        *)
            echo "Uso: $0 [production|staging|rollback]"
            exit 1
            ;;
    esac
}

# Executar
main "$@" 