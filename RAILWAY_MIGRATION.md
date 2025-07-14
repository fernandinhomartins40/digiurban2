# 🚆 Migração para Railway - DigiUrban

## 📋 Visão Geral da Migração

Migração de VPS/Hostinger para Railway com arquitetura monorepo separada:

- **Frontend**: React + Vite (Railway Project 1)
- **Backend**: Node.js + Express (Railway Project 2)
- **Deploy automático**: Via GitHub push
- **Banco de dados**: PostgreSQL Railway integrado

## 🏗️ Nova Arquitetura

```
digiurban-monorepo/
├── frontend/                 # Railway Project 1
│   ├── src/
│   ├── package.json
│   ├── railway.json
│   └── .env.example
├── backend/                  # Railway Project 2
│   ├── src/
│   ├── package.json
│   ├── railway.json
│   └── .env.example
└── README.md
```

## 🚀 Configuração Railway

### 1. Criar Projetos Railway

1. **Frontend Project**:
   - Nome: `digiurban-frontend`
   - Root Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

2. **Backend Project**:
   - Nome: `digiurban-backend`
   - Root Directory: `/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

### 2. Conectar PostgreSQL

1. No backend project, adicionar PostgreSQL service
2. Railway gera automaticamente `DATABASE_URL`
3. Configurar variáveis de ambiente

### 3. Configurar Variáveis de Ambiente

#### Frontend:
```
VITE_API_URL=https://digiurban-backend.up.railway.app
```

#### Backend:
```
PORT=3000
DATABASE_URL=(gerado pelo Railway)
JWT_SECRET=sua-chave-secreta
CORS_ORIGIN=https://digiurban-frontend.up.railway.app
NODE_ENV=production
```

## 📦 Deploy Automático

1. **Conectar GitHub**: Railway detecta mudanças automaticamente
2. **Deploy por pasta**: Railway deploy apenas o que mudou
3. **Build otimizado**: Cache de dependências
4. **Zero downtime**: Deploy sem interrupção

## 🔄 Passo a Passo da Migração

### 1. Backup do projeto atual
### 2. Reestruturação para monorepo
### 3. Configuração Railway
### 4. Deploy inicial
### 5. Testes e validação

## ✅ Benefícios da Migração

- 🚀 **Deploy mais rápido**: 30-60 segundos vs 10 minutos
- 🔧 **Manutenção zero**: Railway gerencia infraestrutura
- 📈 **Escalabilidade**: Auto-scaling incluído
- 💾 **Backup automático**: PostgreSQL Railway
- 🔒 **SSL automático**: HTTPS nativo
- 💰 **Custo otimizado**: Pay-per-use 