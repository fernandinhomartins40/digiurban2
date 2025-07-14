# 🚀 Resumo Completo: Deploy DigiUrban na VPS Hostinger

## 📋 Status do Sistema

✅ **Sistema de Deploy Configurado e Pronto!**

O sistema de deploy automático via GitHub Actions está **100% funcional** e inclui:

- 🔄 **CI/CD automático** com GitHub Actions
- 🐳 **Deploy via SSH** seguro com chave
- 🗄️ **PostgreSQL** configurado automaticamente
- 🔒 **Nginx** como proxy reverso
- 📊 **PM2** para gerenciamento de processos
- 💾 **Backup automático** diário
- 🔍 **Monitoramento** e health checks
- 📝 **Logs** organizados e rotacionados

---

## 🎯 Checklist de Deploy

### 1. ✅ Configurar VPS (Uma vez)

```bash
# Conectar na VPS
ssh root@SEU_IP_VPS

# Executar script de setup
wget https://raw.githubusercontent.com/fernandinhomartins040/digiurban2/main/scripts/setup-vps.sh
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

**O que o script faz:**
- Instala Node.js 18, PostgreSQL, PM2, TypeScript
- Configura firewall e segurança
- Cria estrutura de diretórios
- Gera chave SSH para deploy
- Configura Nginx e SSL
- Configura backup automático
- Instala ferramentas de monitoramento

### 2. ✅ Configurar Secrets no GitHub

Acesse: `Settings → Secrets and variables → Actions`

**Secrets Obrigatórias:**
- `VPS_HOST`: IP da VPS (ex: 185.244.XXX.XXX)
- `VPS_USER`: root
- `VPS_SSH_KEY`: Chave SSH privada (gerada pelo script)
- `VPS_PORT`: 22
- `DB_PASSWORD`: Senha forte para PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT (32+ caracteres)

### 3. ✅ Configurar Domínio

- Apontar `www.digiurban.com.br` para o IP da VPS
- Aguardar propagação DNS (pode levar até 24h)

### 4. ✅ Fazer Deploy

```bash
# Commit e push para main
git add .
git commit -m "deploy: configurações finalizadas"
git push origin main
```

**O workflow irá:**
1. Fazer build da aplicação
2. Conectar na VPS via SSH
3. Baixar o código
4. Instalar dependências
5. Configurar banco de dados
6. Iniciar aplicação com PM2
7. Executar health checks

### 5. ✅ Verificar Deploy

```bash
# Na VPS, executar:
/opt/digiurban/current/scripts/check-deploy.sh
```

---

## 🔧 Arquitetura do Deploy

```
GitHub Repository
       ↓
   GitHub Actions
       ↓
   VPS Hostinger
       ↓
┌─────────────────────────────────────┐
│         Servidor Ubuntu             │
│  ┌─────────────────────────────────┐│
│  │            Nginx                ││
│  │     (Proxy Reverso)             ││
│  │       :80 → :3000               ││
│  └─────────────────────────────────┘│
│              ↓                      │
│  ┌─────────────────────────────────┐│
│  │         DigiUrban App           ││
│  │      (Node.js + PM2)            ││
│  │          :3000                  ││
│  └─────────────────────────────────┘│
│              ↓                      │
│  ┌─────────────────────────────────┐│
│  │        PostgreSQL               ││
│  │          :5432                  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 📂 Estrutura de Arquivos no Servidor

```
/opt/digiurban/
├── current/                    # Aplicação atual (symlink)
├── digiurban2/                # Código fonte
├── backup_YYYYMMDD_HHMMSS/    # Backups automáticos
├── logs/                      # Logs da aplicação
│   ├── error.log
│   ├── out.log
│   └── combined.log
└── backups/                   # Backups do banco
    ├── db_backup_YYYYMMDD_HHMMSS.sql
    └── files_backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## 🚀 Fluxo de Deploy Automático

1. **Push para main** → Trigger GitHub Action
2. **Build** → Compila frontend e backend
3. **SSH Connection** → Conecta na VPS
4. **Download** → Baixa código atualizado
5. **Install** → Instala dependências
6. **Database** → Configura PostgreSQL
7. **Build** → Compila aplicação
8. **Deploy** → Atualiza aplicação
9. **PM2** → Reinicia processo
10. **Health Check** → Verifica funcionamento
11. **Nginx** → Configura proxy
12. **SSL** → Configura certificado (manual)

---

## 📊 Monitoramento e Manutenção

### Comandos Úteis:

```bash
# Status da aplicação
pm2 status
pm2 logs digiurban-minimal

# Status do banco
systemctl status postgresql

# Status do Nginx
systemctl status nginx

# Verificar deploy
/opt/digiurban/current/scripts/check-deploy.sh

# Backup manual
/usr/local/bin/backup-digiurban.sh

# Logs em tempo real
tail -f /opt/digiurban/logs/combined.log
```

### URLs de Monitoramento:

- **Aplicação**: http://SEU_IP:3000
- **Com domínio**: http://www.digiurban.com.br
- **Health check**: http://localhost:3000/api/health

---

## 🔒 Configurar SSL (Após Deploy)

```bash
# Conectar na VPS
ssh root@SEU_IP

# Instalar certificado SSL
sudo certbot --nginx -d www.digiurban.com.br

# Verificar renovação automática
sudo certbot renew --dry-run
```

---

## 🛠️ Troubleshooting

### Deploy Falhou?

1. **Verificar secrets** do GitHub
2. **Verificar logs** do workflow
3. **Verificar conectividade** SSH
4. **Verificar recursos** do servidor

### Aplicação não funciona?

1. **Verificar PM2**: `pm2 status`
2. **Verificar logs**: `pm2 logs digiurban-minimal`
3. **Verificar banco**: `systemctl status postgresql`
4. **Verificar porta**: `netstat -tlnp | grep 3000`

### Comandos de Diagnóstico:

```bash
# Verificar deploy completo
/opt/digiurban/current/scripts/check-deploy.sh

# Restart manual
pm2 restart digiurban-minimal

# Logs detalhados
pm2 logs digiurban-minimal --lines 100

# Status do sistema
htop
df -h
free -h
```

---

## 📈 Próximos Passos

### Opcionais:

1. **Configurar domínio personalizado**
2. **Configurar SSL automático**
3. **Configurar backup em nuvem**
4. **Configurar monitoramento avançado**
5. **Configurar alertas por email/Slack**

### Melhorias Futuras:

1. **Docker deployment**
2. **Load balancer**
3. **Database replication**
4. **CDN integration**
5. **Performance monitoring**

---

## 🎉 Conclusão

O sistema de deploy está **100% funcional** e pronto para uso!

**Benefícios:**
- ✅ Deploy automático a cada commit
- ✅ Zero downtime deployment
- ✅ Backup automático
- ✅ Monitoramento integrado
- ✅ Rollback fácil
- ✅ Logs organizados
- ✅ Health checks automáticos

**Para fazer deploy:**
1. Configure as secrets no GitHub
2. Faça push para main
3. Acompanhe o workflow
4. Verifique a aplicação online

**Suporte:**
- 📧 Logs no GitHub Actions
- 📊 Monitoramento via PM2
- 🔍 Script de verificação
- 📝 Documentação completa

---

**🚀 Digiurban está pronto para produção!** 