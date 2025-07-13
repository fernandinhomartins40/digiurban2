#!/bin/bash

# Script de monitoramento para DigiUrban
# Monitora saúde da aplicação e envia alertas

set -e

# Configurações
APP_DIR="/var/www/digiurban"
LOG_FILE="$APP_DIR/logs/monitor.log"
ALERT_EMAIL="admin@your-domain.com"
WEBHOOK_URL=""  # Slack/Discord webhook se necessário

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    echo "[ERROR] $1" >> "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
    echo "[WARNING] $1" >> "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
    echo "[INFO] $1" >> "$LOG_FILE"
}

# Enviar alerta
send_alert() {
    local message="$1"
    local severity="$2"
    
    # Log local
    case "$severity" in
        "critical")
            error "$message"
            ;;
        "warning")
            warning "$message"
            ;;
        *)
            info "$message"
            ;;
    esac
    
    # Enviar email se configurado
    if [ -n "$ALERT_EMAIL" ] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "DigiUrban Alert - $severity" "$ALERT_EMAIL"
    fi
    
    # Enviar webhook se configurado
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST \
            -H 'Content-type: application/json' \
            --data "{\"text\":\"🚨 DigiUrban Alert: $message\"}" \
            "$WEBHOOK_URL" &> /dev/null || true
    fi
}

# Verificar se containers estão rodando
check_containers() {
    log "Verificando containers..."
    
    local containers=("digiurban_app" "digiurban_db" "digiurban_nginx")
    local failed_containers=()
    
    for container in "${containers[@]}"; do
        if ! docker ps --format "table {{.Names}}" | grep -q "^$container$"; then
            failed_containers+=("$container")
        fi
    done
    
    if [ ${#failed_containers[@]} -eq 0 ]; then
        log "Todos os containers estão rodando"
        return 0
    else
        local message="Containers parados: ${failed_containers[*]}"
        send_alert "$message" "critical"
        return 1
    fi
}

# Verificar saúde da aplicação
check_app_health() {
    log "Verificando saúde da aplicação..."
    
    local health_url="http://localhost:5000/api/health"
    
    if curl -f -s --max-time 10 "$health_url" > /dev/null; then
        log "Aplicação respondendo normalmente"
        return 0
    else
        send_alert "Aplicação não está respondendo no endpoint de saúde" "critical"
        return 1
    fi
}

# Verificar banco de dados
check_database() {
    log "Verificando banco de dados..."
    
    if docker exec digiurban_db pg_isready -U digiurban -d digiurban_db > /dev/null 2>&1; then
        log "Banco de dados respondendo normalmente"
        return 0
    else
        send_alert "Banco de dados não está respondendo" "critical"
        return 1
    fi
}

# Verificar uso de recursos
check_resources() {
    log "Verificando uso de recursos..."
    
    # Verificar uso de CPU
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    if (( $(echo "$cpu_usage > 80" | bc -l) )); then
        send_alert "Alto uso de CPU: ${cpu_usage}%" "warning"
    fi
    
    # Verificar uso de memória
    local mem_usage=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
    if (( $(echo "$mem_usage > 80" | bc -l) )); then
        send_alert "Alto uso de memória: ${mem_usage}%" "warning"
    fi
    
    # Verificar espaço em disco
    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 80 ]; then
        send_alert "Alto uso de disco: ${disk_usage}%" "warning"
    fi
    
    log "Recursos: CPU: ${cpu_usage}%, Mem: ${mem_usage}%, Disk: ${disk_usage}%"
}

# Verificar logs de erro
check_error_logs() {
    log "Verificando logs de erro..."
    
    local error_count=$(docker logs digiurban_app --since "5m" 2>&1 | grep -i "error\|exception\|failed" | wc -l)
    
    if [ "$error_count" -gt 10 ]; then
        send_alert "Muitos erros detectados nos logs: $error_count erros nos últimos 5 minutos" "warning"
    fi
    
    log "Erros nos logs (últimos 5 min): $error_count"
}

# Verificar SSL
check_ssl() {
    log "Verificando certificado SSL..."
    
    local domain=$(grep -o "server_name [^;]*" "$APP_DIR/nginx/conf.d/digiurban.conf" | head -1 | awk '{print $2}')
    
    if [ -n "$domain" ]; then
        local ssl_expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
        local expiry_epoch=$(date -d "$ssl_expiry" +%s)
        local current_epoch=$(date +%s)
        local days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
        
        if [ "$days_left" -lt 30 ]; then
            send_alert "Certificado SSL expira em $days_left dias" "warning"
        fi
        
        log "SSL expira em $days_left dias"
    fi
}

# Verificar backups
check_backups() {
    log "Verificando backups..."
    
    local backup_dir="$APP_DIR/backups"
    local latest_backup=$(ls -t "$backup_dir"/backup_*.sql 2>/dev/null | head -1)
    
    if [ -z "$latest_backup" ]; then
        send_alert "Nenhum backup encontrado" "warning"
        return 1
    fi
    
    local backup_age=$(( ($(date +%s) - $(stat -c %Y "$latest_backup")) / 86400 ))
    
    if [ "$backup_age" -gt 1 ]; then
        send_alert "Backup mais recente tem $backup_age dias" "warning"
    fi
    
    log "Último backup: $backup_age dias atrás"
}

# Gerar relatório de status
generate_status_report() {
    log "Gerando relatório de status..."
    
    local report_file="$APP_DIR/logs/status_report_$(date +%Y%m%d_%H%M%S).json"
    
    cat > "$report_file" << EOF
{
    "timestamp": "$(date -Iseconds)",
    "containers": {
        "app": "$(docker ps --format "table {{.Status}}" --filter "name=digiurban_app" | tail -1)",
        "db": "$(docker ps --format "table {{.Status}}" --filter "name=digiurban_db" | tail -1)",
        "nginx": "$(docker ps --format "table {{.Status}}" --filter "name=digiurban_nginx" | tail -1)"
    },
    "resources": {
        "cpu": "$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')",
        "memory": "$(free -h | grep Mem | awk '{print $3"/"$2}')",
        "disk": "$(df -h / | awk 'NR==2 {print $3"/"$2" ("$5")"}')"
    },
    "uptime": "$(uptime -p)",
    "load": "$(uptime | awk -F'load average:' '{print $2}')"
}
EOF
    
    log "Relatório salvo em: $report_file"
}

# Função principal
main() {
    local mode="$1"
    
    case "$mode" in
        "full")
            log "Iniciando monitoramento completo..."
            check_containers
            check_app_health
            check_database
            check_resources
            check_error_logs
            check_ssl
            check_backups
            generate_status_report
            ;;
        "basic")
            log "Iniciando monitoramento básico..."
            check_containers
            check_app_health
            check_database
            ;;
        "resources")
            check_resources
            ;;
        "report")
            generate_status_report
            ;;
        *)
            echo "Uso: $0 [full|basic|resources|report]"
            echo "  full      - Monitoramento completo"
            echo "  basic     - Verificações básicas"
            echo "  resources - Apenas recursos do sistema"
            echo "  report    - Gerar relatório de status"
            exit 1
            ;;
    esac
    
    log "Monitoramento concluído"
}

# Executar
main "$@" 