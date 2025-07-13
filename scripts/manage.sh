#!/bin/bash

# Script de gerenciamento geral para DigiUrban
# Facilita operações comuns da aplicação

set -e

# Configurações
APP_DIR="/var/www/digiurban"
APP_NAME="digiurban"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
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

# Verificar se estamos no diretório correto
check_directory() {
    if [ ! -f "docker-compose.yml" ]; then
        error "Execute este script no diretório raiz da aplicação ($APP_DIR)"
    fi
}

# Mostrar status dos containers
show_status() {
    log "Status dos containers:"
    docker-compose ps
    echo
    
    log "Recursos do sistema:"
    echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')"
    echo "Memória: $(free -h | grep Mem | awk '{print $3"/"$2}')"
    echo "Disco: $(df -h / | awk 'NR==2 {print $3"/"$2" ("$5")"}')"
    echo
    
    log "Uptime: $(uptime -p)"
}

# Mostrar logs
show_logs() {
    local service="$1"
    local lines="${2:-50}"
    
    case "$service" in
        "app"|"application")
            log "Logs da aplicação (últimas $lines linhas):"
            docker-compose logs --tail="$lines" -f app
            ;;
        "nginx"|"web")
            log "Logs do Nginx (últimas $lines linhas):"
            docker-compose logs --tail="$lines" -f nginx
            ;;
        "db"|"database"|"postgres")
            log "Logs do PostgreSQL (últimas $lines linhas):"
            docker-compose logs --tail="$lines" -f db
            ;;
        "all"|"")
            log "Logs de todos os serviços (últimas $lines linhas):"
            docker-compose logs --tail="$lines" -f
            ;;
        *)
            error "Serviço desconhecido: $service. Use: app, nginx, db, ou all"
            ;;
    esac
}

# Reiniciar serviços
restart_service() {
    local service="$1"
    
    case "$service" in
        "app"|"application")
            log "Reiniciando aplicação..."
            docker-compose restart app
            ;;
        "nginx"|"web")
            log "Reiniciando Nginx..."
            docker-compose restart nginx
            ;;
        "db"|"database"|"postgres")
            log "Reiniciando PostgreSQL..."
            docker-compose restart db
            ;;
        "all"|"")
            log "Reiniciando todos os serviços..."
            docker-compose restart
            ;;
        *)
            error "Serviço desconhecido: $service. Use: app, nginx, db, ou all"
            ;;
    esac
    
    log "Serviço reiniciado com sucesso!"
}

# Executar comando no container
exec_command() {
    local service="$1"
    shift
    local command="$@"
    
    case "$service" in
        "app"|"application")
            docker exec -it "${APP_NAME}_app" $command
            ;;
        "nginx"|"web")
            docker exec -it "${APP_NAME}_nginx" $command
            ;;
        "db"|"database"|"postgres")
            docker exec -it "${APP_NAME}_db" $command
            ;;
        *)
            error "Serviço desconhecido: $service. Use: app, nginx, ou db"
            ;;
    esac
}

# Fazer backup
create_backup() {
    log "Criando backup do banco de dados..."
    
    local backup_file="backups/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if docker exec "${APP_NAME}_db" pg_dump -U digiurban digiurban_db > "$backup_file"; then
        log "Backup criado: $backup_file"
        
        # Mostrar tamanho do backup
        local size=$(du -h "$backup_file" | cut -f1)
        info "Tamanho do backup: $size"
        
        # Manter apenas os últimos 7 backups
        find backups/ -name "backup_*.sql" -type f -mtime +7 -delete
        
        log "Backup concluído com sucesso!"
    else
        error "Falha ao criar backup"
    fi
}

# Restaurar backup
restore_backup() {
    local backup_file="$1"
    
    if [ -z "$backup_file" ]; then
        error "Especifique o arquivo de backup"
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "Arquivo de backup não encontrado: $backup_file"
    fi
    
    warning "ATENÇÃO: Esta operação irá sobrescrever todos os dados do banco!"
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        info "Operação cancelada"
        exit 0
    fi
    
    log "Restaurando backup: $backup_file"
    
    if docker exec -i "${APP_NAME}_db" psql -U digiurban -d digiurban_db < "$backup_file"; then
        log "Backup restaurado com sucesso!"
    else
        error "Falha ao restaurar backup"
    fi
}

# Atualizar aplicação
update_app() {
    log "Atualizando aplicação..."
    
    # Fazer backup antes da atualização
    create_backup
    
    # Atualizar código
    git pull origin main
    
    # Fazer deploy
    ./scripts/deploy.sh production
    
    log "Aplicação atualizada com sucesso!"
}

# Limpar sistema
cleanup() {
    log "Limpando sistema..."
    
    # Parar containers
    docker-compose down
    
    # Remover imagens antigas
    docker image prune -f
    
    # Remover volumes não utilizados
    docker volume prune -f
    
    # Limpar logs antigos
    find logs/ -name "*.log" -type f -mtime +7 -delete
    
    # Limpar backups antigos
    find backups/ -name "backup_*.sql" -type f -mtime +30 -delete
    
    # Subir containers novamente
    docker-compose up -d
    
    log "Limpeza concluída!"
}

# Configurar SSL
setup_ssl() {
    local domain="$1"
    local email="$2"
    
    if [ -z "$domain" ] || [ -z "$email" ]; then
        error "Uso: $0 ssl <dominio> <email>"
    fi
    
    log "Configurando SSL para $domain..."
    
    # Parar Nginx temporariamente
    docker-compose stop nginx
    
    # Obter certificado
    docker run --rm \
        -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
        -v "$(pwd)/certbot/www:/var/www/certbot" \
        -p 80:80 \
        certbot/certbot \
        certonly --standalone \
        --email "$email" \
        --agree-tos \
        --no-eff-email \
        -d "$domain"
    
    # Reiniciar Nginx
    docker-compose start nginx
    
    log "SSL configurado com sucesso!"
}

# Mostrar informações do sistema
show_info() {
    log "Informações do sistema:"
    echo
    echo "Aplicação: DigiUrban"
    echo "Versão: $(git describe --tags --always 2>/dev/null || echo 'unknown')"
    echo "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    echo "Branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
    echo
    echo "Docker:"
    echo "  Versão: $(docker --version)"
    echo "  Compose: $(docker-compose --version)"
    echo
    echo "Sistema:"
    echo "  OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
    echo "  Kernel: $(uname -r)"
    echo "  Arquitetura: $(uname -m)"
    echo
    echo "Diretórios:"
    echo "  App: $APP_DIR"
    echo "  Logs: $APP_DIR/logs"
    echo "  Backups: $APP_DIR/backups"
    echo
}

# Mostrar ajuda
show_help() {
    echo "Script de gerenciamento DigiUrban"
    echo
    echo "Uso: $0 <comando> [opções]"
    echo
    echo "Comandos:"
    echo "  status                    - Mostra status dos containers e sistema"
    echo "  logs [serviço] [linhas]   - Mostra logs (app, nginx, db, all)"
    echo "  restart [serviço]         - Reinicia serviços (app, nginx, db, all)"
    echo "  exec <serviço> <comando>  - Executa comando no container"
    echo "  backup                    - Cria backup do banco de dados"
    echo "  restore <arquivo>         - Restaura backup do banco"
    echo "  update                    - Atualiza aplicação"
    echo "  cleanup                   - Limpa sistema (containers, logs, backups)"
    echo "  ssl <domínio> <email>     - Configura SSL"
    echo "  info                      - Mostra informações do sistema"
    echo "  help                      - Mostra esta ajuda"
    echo
    echo "Exemplos:"
    echo "  $0 status"
    echo "  $0 logs app 100"
    echo "  $0 restart nginx"
    echo "  $0 exec app bash"
    echo "  $0 backup"
    echo "  $0 restore backups/backup_20231201_120000.sql"
    echo "  $0 ssl meudominio.com admin@meudominio.com"
    echo
}

# Função principal
main() {
    local command="$1"
    
    # Verificar se estamos no diretório correto
    check_directory
    
    case "$command" in
        "status")
            show_status
            ;;
        "logs")
            show_logs "$2" "$3"
            ;;
        "restart")
            restart_service "$2"
            ;;
        "exec")
            exec_command "$2" "${@:3}"
            ;;
        "backup")
            create_backup
            ;;
        "restore")
            restore_backup "$2"
            ;;
        "update")
            update_app
            ;;
        "cleanup")
            cleanup
            ;;
        "ssl")
            setup_ssl "$2" "$3"
            ;;
        "info")
            show_info
            ;;
        "help"|""|"-h"|"--help")
            show_help
            ;;
        *)
            error "Comando desconhecido: $command"
            show_help
            ;;
    esac
}

# Executar
main "$@" 