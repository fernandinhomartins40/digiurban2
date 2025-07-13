# 🔄 Migração: Deploy Complexo → Deploy Minimal

## 📋 Resumo da Migração

Migração do sistema de deploy complexo (Docker + SSL + Nginx) para sistema simplificado (PM2 + Node.js direto).

### ✨ Benefícios da Migração:

- ⚡ **3x mais rápido** - Deploy em ~3 minutos vs ~10 minutos
- 🔐 **Menos secrets** - 3 secrets vs 8+ secrets
- 🛠️ **Manutenção simples** - PM2 vs Docker + Nginx + SSL
- 🐛 **Debug fácil** - Logs diretos vs containers
- 📦 **Menos dependências** - Node.js vs Docker ecosystem

---

## 📊 Comparação dos Sistemas

| Aspecto | Sistema Complexo | Sistema Minimal |
|---------|------------------|-----------------|
| **Tempo Deploy** | 10-15 minutos | 2-3 minutos |
| **Arquivos Config** | 15+ arquivos | 4 arquivos |
| **Secrets GitHub** | 8+ secrets | 3 secrets |
| **Containers** | 5 containers | 0 containers |
| **SSL/HTTPS** | Automático | Manual/Opcional |
| **Backup** | Automático | Manual/Opcional |
| **Monitoramento** | Automático | Manual/Opcional |
| **Rollback** | Automático | Manual via PM2 |

---

## 🔧 Passo a Passo da Migração

### 1. **Backup do Sistema Atual**
```bash
# No VPS atual
cd /var/www/digiurban
sudo ./scripts/manage.sh backup
```

### 2. **Simplificar GitHub Secrets**

#### Secrets a MANTER:
```
VPS_HOST=185.244.XXX.XXX
VPS_USERNAME=root
VPS_PASSWORD=sua-senha-ssh
```

#### Secrets a MIGRAR (opcionais):
```
DB_PASSWORD=sua-senha-db
JWT_SECRET=sua-chave-jwt
```

#### Secrets a REMOVER:
```
❌ VPS_USER, VPS_PORT, VPS_SSH_KEY
❌ SLACK_WEBHOOK
❌ SMTP_HOST, SMTP_USER, SMTP_PASS
❌ REDIS_PASSWORD
❌ CORS_ORIGIN (hardcoded no workflow)
```

### 3. **Parar Sistema Atual**
```bash
# No VPS
cd /var/www/digiurban
sudo docker-compose down
```

### 4. **Limpar Ambiente**
```bash
# Remover containers e volumes (OPCIONAL)
sudo docker system prune -a --volumes

# Manter dados do banco se necessário
sudo cp -r /var/www/digiurban/postgres_data /backup/
```

### 5. **Testar Novo Sistema**
1. Fazer push para branch de teste
2. Executar workflow minimal
3. Verificar aplicação funcionando

---

## 🗂️ Arquivos Afetados

### ✅ Arquivos NOVOS:
- `.github/workflows/deploy-minimal.yml`
- `ecosystem.config.js`
- `Dockerfile.minimal`
- `DEPLOY_MINIMAL.md`
- `MIGRACAO_DEPLOY.md`

### ⚠️ Arquivos a MANTER (não usar):
- `.github/workflows/deploy.yml` (antigo)
- `docker-compose.yml` (antigo)
- `Dockerfile` (antigo)
- `nginx/` (antigo)
- `scripts/` (antigo)

### 🔄 Arquivos MODIFICADOS:
- `package.json` (novos scripts)

---

## 🚀 Executar Migração

### 1. **Primeiro Deploy**
```bash
# Ir para GitHub Actions
# Executar "🚀 Deploy DigiUrban Minimal"
# Aguardar ~3 minutos
```

### 2. **Verificar Aplicação**
```bash
# Testar endpoints
curl http://VPS_IP:5000/api/health
curl http://VPS_IP:5000/

# Verificar PM2
ssh root@VPS_IP
pm2 status digiurban-minimal
pm2 logs digiurban-minimal
```

### 3. **Configurar Domínio (Opcional)**
```bash
# No VPS - Configurar Nginx simples
sudo apt install nginx
sudo nano /etc/nginx/sites-available/digiurban

# Conteúdo básico:
server {
    listen 80;
    server_name www.digiurban.com.br;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Ativar site
sudo ln -s /etc/nginx/sites-available/digiurban /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 🔍 Verificação Pós-Migração

### ✅ Checklist:
- [ ] Aplicação funcionando em http://VPS_IP:5000
- [ ] Banco de dados com dados migrados
- [ ] PM2 gerenciando processo
- [ ] Logs acessíveis via PM2
- [ ] Deploy automático no GitHub Actions

### 🧪 Testes:
```bash
# Teste de deploy
git commit -m "test: migration"
git push origin main

# Teste de aplicação
curl http://VPS_IP:5000/api/health
curl http://VPS_IP:5000/

# Teste de restart
ssh root@VPS_IP
pm2 restart digiurban-minimal
```

---

## 🆘 Rollback (se necessário)

### Se algo der errado:
```bash
# Parar novo sistema
pm2 stop digiurban-minimal

# Restaurar sistema antigo
cd /var/www/digiurban
sudo docker-compose up -d

# Restaurar backup do banco
sudo cp -r /backup/postgres_data /var/www/digiurban/
```

---

## 📝 Configuração Manual Pós-Migração

### 1. **SSL/HTTPS (Opcional)**
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot --nginx -d www.digiurban.com.br

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. **Backup Automático (Opcional)**
```bash
# Criar script de backup
sudo nano /opt/digiurban/backup.sh

#!/bin/bash
pg_dump -h localhost -U digiurban digiurban_db > /opt/digiurban/backup_$(date +%Y%m%d).sql
find /opt/digiurban -name "backup_*.sql" -mtime +7 -delete

# Agendar backup
sudo crontab -e
# Adicionar: 0 2 * * * /opt/digiurban/backup.sh
```

### 3. **Monitoramento (Opcional)**
```bash
# Instalar htop
sudo apt install htop

# Monitorar aplicação
htop
pm2 monit
```

---

## 🎯 Resultado Final

### Estrutura Final:
```
/opt/digiurban/
├── current/              # Aplicação atual
├── digiurban2/           # Código fonte
├── logs/                 # Logs PM2
├── backup_YYYYMMDD/      # Backups antigos
└── ecosystem.config.js   # Config PM2
```

### GitHub Actions:
- 1 workflow ativo: `deploy-minimal.yml`
- 3 secrets configuradas
- Deploy em ~3 minutos

### VPS:
- Node.js 18 + PM2
- PostgreSQL local
- Nginx simples (opcional)
- SSL manual (opcional)

---

## 📞 Suporte

### Problemas Comuns:

1. **PM2 não inicia**:
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

2. **Banco não conecta**:
   ```bash
   sudo systemctl start postgresql
   sudo -u postgres psql -c "ALTER USER digiurban WITH PASSWORD 'nova_senha';"
   ```

3. **Deploy falha**:
   - Verificar secrets no GitHub
   - Verificar SSH na VPS
   - Verificar logs do workflow

---

**🎉 Migração Concluída!** 

Sistema agora é mais simples, rápido e fácil de manter. Deploy em 3 minutos! 🚀 