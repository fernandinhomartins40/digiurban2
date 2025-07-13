# 🚀 Deploy Minimal - DigiUrban

## 📋 Resumo do Sistema

Sistema de deploy simplificado baseado no fuseloja, otimizado para facilidade e manutenção.

### ✨ Características:

- 🏗️ **Build simples** - Vite build + Node.js
- 📦 **Deploy direto** - Sem Docker, direto no VPS
- 🔄 **PM2** - Gerenciamento de processos
- 🗄️ **PostgreSQL** - Banco de dados local
- 🔐 **Secrets mínimas** - Apenas 3 secrets obrigatórias
- ⚡ **Deploy rápido** - ~2-3 minutos

---

## 🎯 Pré-requisitos

### 1. ✅ VPS Requirements
- Ubuntu/Debian com acesso root
- Domínio www.digiurban.com.br apontado para VPS
- PostgreSQL instalado (ou será instalado automaticamente)

### 2. ✅ GitHub Secrets
Configure no GitHub: `Settings` → `Secrets and variables` → `Actions`

#### Obrigatórias:
- `VPS_HOST` - IP da VPS (ex: 185.244.XXX.XXX)
- `VPS_USERNAME` - Usuário SSH (ex: root)
- `VPS_PASSWORD` - Senha SSH

#### Opcionais:
- `DB_PASSWORD` - Senha do PostgreSQL (padrão: postgres)
- `JWT_SECRET` - Secret para JWT (padrão: gerado)

---

## 🔄 Como Usar

### Deploy Automático
```bash
# Fazer mudanças no código
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# GitHub Actions fará o deploy automaticamente
```

### Deploy Manual
No GitHub:
1. Ir para `Actions`
2. Clicar em `🚀 Deploy DigiUrban Minimal`
3. Clicar em `Run workflow`
4. Aguardar ~3 minutos

---

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Push   │───▶│  GitHub Actions │───▶│   VPS Deploy    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                              ┌─────────────────────────────────────┐
                              │         /opt/digiurban/current      │
                              │  ┌─────────────────────────────────┐│
                              │  │  Frontend (dist/) + Backend     ││
                              │  │  PM2 → Node.js → PostgreSQL    ││
                              │  │  Port 5000                      ││
                              │  └─────────────────────────────────┘│
                              └─────────────────────────────────────┘
```

### Estrutura no VPS:
```
/opt/digiurban/
├── current/              # Symlink para versão atual
├── digiurban2/           # Código da aplicação
├── logs/                 # Logs PM2
├── backup_YYYYMMDD/      # Backups automáticos
└── ecosystem.config.js   # Configuração PM2
```

---

## 🔧 Comandos Úteis

### No VPS:
```bash
# Conectar na VPS
ssh root@your-vps-ip

# Navegar para aplicação
cd /opt/digiurban/current

# Ver status PM2
pm2 status digiurban-minimal

# Ver logs
pm2 logs digiurban-minimal

# Restart aplicação
pm2 restart digiurban-minimal

# Parar aplicação
pm2 stop digiurban-minimal

# Verificar saúde
curl http://localhost:5000/api/health
```

### Scripts NPM disponíveis:
```bash
# Deploy via PM2
npm run deploy:minimal

# Ver logs de produção
npm run logs:production

# Status da aplicação
npm run status:production

# Restart
npm run restart:production
```

---

## 📊 Fluxo de Deploy

### 1. **Trigger** (Push ou manual)
- GitHub Actions detecta mudanças
- Inicia processo de build

### 2. **Build** (30-60s)
- Instala dependências
- Vite build do frontend
- Testa inicialização do backend

### 3. **Deploy** (60-120s)
- Conecta na VPS via SSH
- Instala Node.js/PM2 se necessário
- Clona código do GitHub
- Instala dependências
- Faz build da aplicação
- Copia frontend para backend/public
- Configura PostgreSQL
- Inicia aplicação com PM2

### 4. **Verificação** (15-30s)
- Health check na aplicação
- Testa endpoints
- Verifica logs PM2

---

## 🐛 Troubleshooting

### Deploy falha no build:
```bash
# Verificar se dependências estão corretas
npm ci --silent
npm run build
```

### Aplicação não inicia:
```bash
# Verificar logs
pm2 logs digiurban-minimal

# Verificar processo
pm2 status

# Restart
pm2 restart digiurban-minimal
```

### Banco de dados não conecta:
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Verificar banco
sudo -u postgres psql -l

# Verificar usuário
sudo -u postgres psql -c "\du"
```

---

## 🎉 Vantagens vs Deploy Complexo

| Aspecto | Deploy Complexo | Deploy Minimal |
|---------|-----------------|----------------|
| **Tempo** | 10-15 minutos | 2-3 minutos |
| **Complexidade** | Docker + SSL + Nginx | PM2 + Node.js |
| **Secrets** | 8+ secrets | 3 secrets |
| **Manutenção** | Alta | Baixa |
| **Debugging** | Difícil | Simples |
| **Recursos** | Alto | Baixo |

---

## 📝 Exemplo de .env

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgres://digiurban:password@localhost:5432/digiurban_db
JWT_SECRET=your-very-long-secret-key
CORS_ORIGIN=https://www.digiurban.com.br
```

---

## 🔄 Arquivos Criados

- `.github/workflows/deploy-minimal.yml` - GitHub Actions workflow
- `ecosystem.config.js` - Configuração PM2
- `Dockerfile.minimal` - Docker opcional
- `DEPLOY_MINIMAL.md` - Esta documentação

---

## 🚀 Próximos Passos

1. **Configurar secrets** no GitHub
2. **Fazer primeiro deploy** manual
3. **Testar aplicação** em produção
4. **Configurar domínio** (opcional)
5. **Monitorar logs** e performance

---

**🎯 Objetivo**: Deploy simples, rápido e confiável para DigiUrban! 