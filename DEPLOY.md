# Deploy Automatizado - DigiUrban

Este documento descreve como configurar e usar o sistema de deploy automatizado para a aplicação DigiUrban em uma VPS da Hostinger.

## 📋 Visão Geral

O sistema implementa um pipeline completo de CI/CD com:
- **GitHub Actions** para automação
- **Docker** para containerização
- **Nginx** como proxy reverso
- **PostgreSQL** como banco de dados
- **Let's Encrypt** para SSL
- **Monitoramento** e alertas
- **Backup** automatizado

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions │───▶│   VPS Hostinger │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                              ┌─────────────────────────────────────┐
                              │            Docker Containers        │
                              │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
                              │  │  Nginx  │ │   App   │ │   DB    ││
                              │  │  :80    │ │  :5000  │ │  :5432  ││
                              │  │  :443   │ │         │ │         ││
                              │  └─────────┘ └─────────┘ └─────────┘│
                              └─────────────────────────────────────┘
```

## 🚀 Configuração Inicial

### 1. Preparar o VPS

Execute no servidor da Hostinger:

```bash
# Baixar e executar script de setup
wget https://raw.githubusercontent.com/seu-usuario/digiurban2/main/scripts/setup-vps.sh
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

O script irá:
- Atualizar o sistema
- Instalar Docker e Docker Compose
- Configurar firewall
- Criar usuário para aplicação
- Configurar SSL com Let's Encrypt
- Configurar backups automáticos

### 2. Configurar GitHub Secrets

No repositório GitHub, adicione os seguintes secrets:

```
VPS_HOST=seu-ip-da-vps
VPS_USER=digiurban
VPS_PORT=22
VPS_SSH_KEY=sua-chave-ssh-privada
SLACK_WEBHOOK=seu-webhook-slack (opcional)
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env` no servidor:

```bash
sudo nano /var/www/digiurban/.env
```

Ajuste as variáveis conforme sua configuração:

```bash
# Banco de dados
DB_PASSWORD=sua_senha_segura_do_banco

# Segurança
JWT_SECRET=sua_chave_jwt_muito_longa_e_segura

# Domínio
CORS_ORIGIN=https://seu-dominio.com

# Redis
REDIS_PASSWORD=sua_senha_do_redis

# Email
SMTP_HOST=smtp.hostinger.com
SMTP_USER=seu-email@seu-dominio.com
SMTP_PASS=sua_senha_do_email
```

### 4. Configurar Nginx

Edite a configuração do Nginx:

```bash
sudo nano /var/www/digiurban/nginx/conf.d/digiurban.conf
```

Substitua `your-domain.com` pelo seu domínio real.

## 🔄 Processo de Deploy

### Deploy Automático

O deploy é executado automaticamente quando:
- Push para branch `main` ou `master`
- Pull request é merged

### Deploy Manual

Para fazer deploy manual:

```bash
# No servidor VPS
cd /var/www/digiurban
sudo -u digiurban ./scripts/deploy.sh production
```

### Rollback

Para reverter um deploy:

```bash
cd /var/www/digiurban
sudo -u digiurban ./scripts/deploy.sh rollback
```

## 📊 Monitoramento

### Verificação Manual

```bash
# Verificação completa
sudo -u digiurban ./scripts/monitor.sh full

# Verificação básica
sudo -u digiurban ./scripts/monitor.sh basic

# Apenas recursos
sudo -u digiurban ./scripts/monitor.sh resources

# Gerar relatório
sudo -u digiurban ./scripts/monitor.sh report
```

### Monitoramento Automático

O sistema executa verificações automaticamente:
- Monitoramento básico a cada 5 minutos
- Verificação completa a cada hora
- Alertas via email/webhook em caso de problemas

## 🔒 SSL/TLS

### Configuração Automática

O SSL é configurado automaticamente com Let's Encrypt durante o setup inicial.

### Renovação Manual

```bash
cd /var/www/digiurban
docker-compose exec certbot certbot renew
docker-compose exec nginx nginx -s reload
```

### Verificar Status

```bash
# Verificar certificado
openssl s_client -connect seu-dominio.com:443 -servername seu-dominio.com
```

## 💾 Backup

### Backup Automático

Backups são criados automaticamente:
- Diariamente às 2:00 AM
- Mantém 7 backups mais recentes
- Salva em `/var/www/digiurban/backups/`

### Backup Manual

```bash
cd /var/www/digiurban
docker exec digiurban_db pg_dump -U digiurban digiurban_db > backups/backup_manual_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar Backup

```bash
cd /var/www/digiurban
docker exec -i digiurban_db psql -U digiurban -d digiurban_db < backups/backup_YYYYMMDD_HHMMSS.sql
```

## 🔧 Comandos Úteis

### Docker

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f db

# Reiniciar um container
docker-compose restart app

# Executar comando no container
docker exec -it digiurban_app bash
```

### Nginx

```bash
# Testar configuração
docker exec digiurban_nginx nginx -t

# Recarregar configuração
docker exec digiurban_nginx nginx -s reload

# Ver logs
docker logs digiurban_nginx
```

### PostgreSQL

```bash
# Acessar banco
docker exec -it digiurban_db psql -U digiurban -d digiurban_db

# Ver conexões ativas
docker exec digiurban_db psql -U digiurban -d digiurban_db -c "SELECT * FROM pg_stat_activity;"
```

## 🚨 Solução de Problemas

### Aplicação não está respondendo

1. Verificar se containers estão rodando:
   ```bash
   docker-compose ps
   ```

2. Verificar logs:
   ```bash
   docker-compose logs -f app
   ```

3. Reiniciar aplicação:
   ```bash
   docker-compose restart app
   ```

### Erro de SSL

1. Verificar certificado:
   ```bash
   openssl x509 -in /var/www/digiurban/certbot/conf/live/seu-dominio.com/cert.pem -text -noout
   ```

2. Renovar certificado:
   ```bash
   docker-compose exec certbot certbot renew --force-renewal
   ```

### Banco de dados não conecta

1. Verificar se PostgreSQL está rodando:
   ```bash
   docker exec digiurban_db pg_isready -U digiurban
   ```

2. Verificar logs:
   ```bash
   docker logs digiurban_db
   ```

3. Reiniciar banco:
   ```bash
   docker-compose restart db
   ```

### Deploy falha

1. Verificar logs do GitHub Actions
2. Verificar conectividade SSH
3. Verificar espaço em disco:
   ```bash
   df -h
   ```

## 📈 Performance

### Otimizações Implementadas

- **Nginx**: Compressão gzip, cache de arquivos estáticos
- **Docker**: Multi-stage build, usuário não-root
- **PostgreSQL**: Configurações otimizadas
- **Aplicação**: Build otimizado com Vite

### Métricas

O sistema monitora:
- Tempo de resposta da aplicação
- Uso de CPU, memória e disco
- Número de conexões ativas
- Erros nos logs

## 🔐 Segurança

### Medidas Implementadas

- **Firewall**: Apenas portas necessárias abertas
- **SSL**: Certificados Let's Encrypt
- **Docker**: Usuário não-root nos containers
- **Nginx**: Headers de segurança
- **PostgreSQL**: Usuário dedicado
- **Fail2ban**: Proteção contra ataques

### Auditoria

```bash
# Verificar logs de segurança
sudo tail -f /var/log/auth.log

# Verificar tentativas de login
sudo grep "Failed password" /var/log/auth.log

# Ver conexões ativas
sudo netstat -tulpn
```

## 📞 Suporte

### Logs Importantes

- **Aplicação**: `/var/www/digiurban/logs/app.log`
- **Deploy**: `/var/www/digiurban/logs/deploy.log`
- **Nginx**: `docker logs digiurban_nginx`
- **PostgreSQL**: `docker logs digiurban_db`

### Contatos

- **Administrador**: admin@seu-dominio.com
- **Suporte**: suporte@seu-dominio.com

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Nota**: Este sistema foi configurado para máxima confiabilidade e segurança. Em caso de dúvidas, consulte a documentação ou entre em contato com o suporte. 