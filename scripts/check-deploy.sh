#!/bin/bash

# 🔍 Script de Verificação de Deploy DigiUrban
# Verifica se o deploy está funcionando corretamente

set -e

# Configurações
APP_NAME="digiurban-minimal"
APP_DIR="/opt/digiurban"
DOMAIN="www.digiurban.com.br"
PORT=3000

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[OK] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar se PM2 está instalado
check_pm2() {
    info "Verificando PM2..."
    if command -v pm2 &> /dev/null; then
        log "PM2 está instalado"
        pm2 --version
    else
        error "PM2 não está instalado"
        return 1
    fi
}

# Verificar status do PM2
check_pm2_status() {
    info "Verificando status do PM2..."
    
    if pm2 status | grep -q "$APP_NAME"; then
        status=$(pm2 jlist | jq -r ".[] | select(.name==\"$APP_NAME\") | .pm2_env.status")
        if [ "$status" == "online" ]; then
            log "Aplicação está rodando no PM2"
        else
            error "Aplicação não está online no PM2 (status: $status)"
            return 1
        fi
    else
        error "Aplicação não encontrada no PM2"
        return 1
    fi
}

# Verificar se Node.js está instalado
check_nodejs() {
    info "Verificando Node.js..."
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        log "Node.js está instalado: $node_version"
        
        if command -v npm &> /dev/null; then
            npm_version=$(npm --version)
            log "NPM está instalado: $npm_version"
        else
            error "NPM não está instalado"
            return 1
        fi
    else
        error "Node.js não está instalado"
        return 1
    fi
}

# Verificar PostgreSQL
check_postgresql() {
    info "Verificando PostgreSQL..."
    
    if systemctl is-active --quiet postgresql; then
        log "PostgreSQL está rodando"
        
        # Verificar se o banco existe
        if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw digiurban_db; then
            log "Banco de dados 'digiurban_db' existe"
        else
            error "Banco de dados 'digiurban_db' não encontrado"
            return 1
        fi
    else
        error "PostgreSQL não está rodando"
        return 1
    fi
}

# Verificar porta
check_port() {
    info "Verificando porta $PORT..."
    
    if netstat -tlnp | grep -q ":$PORT"; then
        log "Porta $PORT está em uso"
        process=$(netstat -tlnp | grep ":$PORT" | awk '{print $7}')
        log "Processo: $process"
    else
        error "Porta $PORT não está em uso"
        return 1
    fi
}

# Verificar health check
check_health() {
    info "Verificando health check..."
    
    for i in {1..5}; do
        if curl -f -s "http://localhost:$PORT/api/health" > /dev/null; then
            log "Health check passou!"
            return 0
        else
            warning "Health check falhou (tentativa $i/5)"
            sleep 2
        fi
    done
    
    error "Health check falhou após 5 tentativas"
    return 1
}

# Verificar arquivos da aplicação
check_app_files() {
    info "Verificando arquivos da aplicação..."
    
    if [ -d "$APP_DIR/current" ]; then
        log "Diretório da aplicação existe"
        
        # Verificar arquivos essenciais
        if [ -f "$APP_DIR/current/dist-server/server/index.js" ]; then
            log "Arquivo do servidor existe"
        else
            error "Arquivo do servidor não encontrado"
            return 1
        fi
        
        if [ -d "$APP_DIR/current/dist-server/public" ]; then
            log "Arquivos do frontend existem"
        else
            error "Arquivos do frontend não encontrados"
            return 1
        fi
        
        if [ -f "$APP_DIR/current/.env" ]; then
            log "Arquivo .env existe"
        else
            warning "Arquivo .env não encontrado"
        fi
    else
        error "Diretório da aplicação não encontrado"
        return 1
    fi
}

# Verificar logs
check_logs() {
    info "Verificando logs..."
    
    if [ -d "$APP_DIR/logs" ]; then
        log "Diretório de logs existe"
        
        # Mostrar logs recentes
        if [ -f "$APP_DIR/logs/error.log" ]; then
            error_count=$(tail -n 50 "$APP_DIR/logs/error.log" | grep -c "ERROR" || echo "0")
            if [ "$error_count" -gt 0 ]; then
                warning "Encontrados $error_count erros nos logs recentes"
            else
                log "Nenhum erro encontrado nos logs recentes"
            fi
        fi
        
        if [ -f "$APP_DIR/logs/out.log" ]; then
            log "Log de saída existe"
        fi
    else
        warning "Diretório de logs não encontrado"
    fi
}

# Verificar Nginx
check_nginx() {
    info "Verificando Nginx..."
    
    if systemctl is-active --quiet nginx; then
        log "Nginx está rodando"
        
        # Verificar configuração
        if nginx -t 2>/dev/null; then
            log "Configuração do Nginx está válida"
        else
            error "Configuração do Nginx tem erros"
            return 1
        fi
    else
        warning "Nginx não está rodando"
    fi
}

# Verificar conectividade externa
check_external_connectivity() {
    info "Verificando conectividade externa..."
    
    # Verificar se o domínio resolve
    if nslookup "$DOMAIN" > /dev/null 2>&1; then
        log "Domínio $DOMAIN resolve corretamente"
    else
        warning "Domínio $DOMAIN não resolve"
    fi
    
    # Verificar conexão HTTP
    if curl -f -s "http://$DOMAIN" > /dev/null; then
        log "Conexão HTTP funcionando"
    else
        warning "Conexão HTTP não funcionando"
    fi
    
    # Verificar conexão HTTPS
    if curl -f -s "https://$DOMAIN" > /dev/null; then
        log "Conexão HTTPS funcionando"
    else
        warning "Conexão HTTPS não funcionando"
    fi
}

# Mostrar informações do sistema
show_system_info() {
    info "Informações do sistema:"
    echo -e "${BLUE}  - Uptime: $(uptime)${NC}"
    echo -e "${BLUE}  - Uso de memória: $(free -h | grep Mem | awk '{print $3"/"$2}')${NC}"
    echo -e "${BLUE}  - Uso de disco: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5")"}')${NC}"
    echo -e "${BLUE}  - Load average: $(cat /proc/loadavg)${NC}"
}

# Função principal
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}🔍 VERIFICAÇÃO DE DEPLOY DIGIURBAN${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    # Contadores
    passed=0
    failed=0
    
    # Executar verificações
    checks=(
        "check_nodejs"
        "check_pm2"
        "check_postgresql"
        "check_app_files"
        "check_pm2_status"
        "check_port"
        "check_health"
        "check_nginx"
        "check_logs"
        "check_external_connectivity"
    )
    
    for check in "${checks[@]}"; do
        if $check; then
            ((passed++))
        else
            ((failed++))
        fi
        echo ""
    done
    
    # Mostrar informações do sistema
    show_system_info
    
    # Resumo
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}📊 RESUMO DA VERIFICAÇÃO${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo -e "${GREEN}✅ Verificações aprovadas: $passed${NC}"
    echo -e "${RED}❌ Verificações falharam: $failed${NC}"
    echo ""
    
    if [ $failed -eq 0 ]; then
        echo -e "${GREEN}🎉 DEPLOY FUNCIONANDO PERFEITAMENTE!${NC}"
        echo -e "${GREEN}✅ Aplicação está online e funcionando corretamente${NC}"
        echo ""
        echo -e "${BLUE}🔗 URLs de acesso:${NC}"
        echo -e "  - Aplicação: http://$(curl -s ifconfig.me):3000"
        echo -e "  - Com domínio: http://$DOMAIN"
        echo -e "  - Health check: http://localhost:$PORT/api/health"
        
        exit 0
    else
        echo -e "${RED}❌ PROBLEMAS DETECTADOS NO DEPLOY${NC}"
        echo -e "${YELLOW}⚠️ Verifique os erros acima e corrija-os${NC}"
        echo ""
        echo -e "${BLUE}🔧 Comandos úteis para diagnóstico:${NC}"
        echo -e "  - pm2 status"
        echo -e "  - pm2 logs $APP_NAME"
        echo -e "  - systemctl status postgresql"
        echo -e "  - systemctl status nginx"
        echo -e "  - tail -f $APP_DIR/logs/error.log"
        
        exit 1
    fi
}

# Executar verificação
main "$@" 