# 🚀 Deploy Rápido - DigiUrban

## ⚡ Configuração Inicial (5 minutos)

### 1. Configurar VPS
```bash
# No servidor Hostinger
wget https://raw.githubusercontent.com/seu-usuario/digiurban2/main/scripts/setup-vps.sh
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

### 2. Configurar GitHub Secrets
```
VPS_HOST=seu-ip-vps
VPS_USER=digiurban
VPS_SSH_KEY=sua-chave-ssh-privada
```

### 3. Configurar Variáveis (.env)
```bash
# No servidor
sudo nano /var/www/digiurban/.env

# Configurar:
DB_PASSWORD=senha_segura_db
JWT_SECRET=chave_jwt_muito_longa
CORS_ORIGIN=https://seu-dominio.com
```

### 4. Configurar Domínio
```bash
# Editar configuração do Nginx
sudo nano /var/www/digiurban/nginx/conf.d/digiurban.conf

# Substituir 'your-domain.com' pelo seu domínio
```

## 🔄 Deploy Automático

**Pronto!** Agora todo push na branch `main` fará deploy automático:

1. **Push** → GitHub Actions
2. **Build** → Docker Container
3. **Deploy** → VPS Hostinger
4. **SSL** → Let's Encrypt
5. **Monitoring** → Alertas automáticos

## 📋 Comandos Úteis

```bash
# No servidor VPS
cd /var/www/digiurban

# Status da aplicação
./scripts/manage.sh status

# Ver logs
./scripts/manage.sh logs app

# Fazer backup
./scripts/manage.sh backup

# Monitorar aplicação
./scripts/monitor.sh full

# Deploy manual
./scripts/deploy.sh production

# Rollback
./scripts/deploy.sh rollback
```

## 🌟 Recursos Incluídos

✅ **CI/CD Completo** - Deploy automático a cada push
✅ **SSL/HTTPS** - Certificados Let's Encrypt automáticos
✅ **Monitoramento** - Alertas e health checks
✅ **Backup** - Backup automático do banco de dados
✅ **Segurança** - Firewall, headers de segurança, containers seguros
✅ **Performance** - Nginx otimizado, compressão, cache
✅ **Logs** - Sistema completo de logging
✅ **Rollback** - Reverter deploys em caso de problema

## 🔧 Arquivos Criados

### Docker
- `Dockerfile` - Configuração do container
- `docker-compose.yml` - Orquestração dos serviços
- `.dockerignore` - Arquivos a ignorar no build

### Nginx
- `nginx/nginx.conf` - Configuração principal
- `nginx/conf.d/digiurban.conf` - Configuração do site

### Scripts
- `scripts/setup-vps.sh` - Setup inicial do servidor
- `scripts/deploy.sh` - Deploy da aplicação
- `scripts/monitor.sh` - Monitoramento
- `scripts/manage.sh` - Gerenciamento geral

### GitHub Actions
- `.github/workflows/deploy.yml` - Pipeline de deploy

### Configurações
- `.env.production` - Variáveis de ambiente
- `DEPLOY.md` - Documentação completa

## 🚨 Importante

1. **Substitua** `your-domain.com` pelo seu domínio real
2. **Configure** senhas seguras no `.env`
3. **Adicione** os secrets no GitHub
4. **Teste** o deploy antes de colocar em produção
5. **Monitore** regularmente com `./scripts/monitor.sh full`

## 📞 Suporte

- **Logs**: `/var/www/digiurban/logs/`
- **Backups**: `/var/www/digiurban/backups/`
- **Documentação**: `DEPLOY.md`
- **Comandos**: `./scripts/manage.sh help`

---

**Deploy configurado com sucesso!** 🎉

A aplicação DigiUrban agora possui um sistema completo de deploy automatizado, monitoramento e backup para sua VPS da Hostinger. 