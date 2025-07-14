# Frontend Integration - Railway Migration

Guia para integrar o frontend React com o novo backend Railway.

## 🔄 Mudanças no Frontend

### 1. Configuração da API Base URL

Atualize o arquivo de configuração da API:

```typescript
// src/lib/api.ts
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  baseURL: API_BASE_URL,
  
  // Endpoints mantidos exatamente iguais
  users: `${API_BASE_URL}/api/users`,
  chat: {
    rooms: `${API_BASE_URL}/api/chat/rooms`,
    messages: (roomId: string) => `${API_BASE_URL}/api/chat/rooms/${roomId}/messages`,
    sendMessage: (roomId: string) => `${API_BASE_URL}/api/chat/rooms/${roomId}/messages`,
    markAsRead: (roomId: string, messageId: string) => 
      `${API_BASE_URL}/api/chat/rooms/${roomId}/messages/${messageId}/read`
  },
  alerts: {
    categories: `${API_BASE_URL}/api/alerts/categories`,
    alerts: `${API_BASE_URL}/api/alerts/alerts`,
    create: `${API_BASE_URL}/api/alerts/alerts`,
    myAlerts: `${API_BASE_URL}/api/alerts/my-alerts`,
    markAsRead: (alertId: string) => `${API_BASE_URL}/api/alerts/alerts/${alertId}/read`,
    statistics: `${API_BASE_URL}/api/alerts/statistics`
  },
  health: `${API_BASE_URL}/api/health`
};
```

### 2. Variáveis de Ambiente

Crie/atualize o arquivo `.env`:

```bash
# Backend Railway URL
VITE_API_URL=https://your-backend.railway.app

# Frontend Vite
VITE_PORT=5173
```

### 3. Hooks de API (Mantidos Iguais)

Os hooks existentes continuam funcionando sem alterações:

```typescript
// src/hooks/useChat.tsx - SEM MUDANÇAS
// src/hooks/useAlerts.tsx - SEM MUDANÇAS
```

### 4. Componentes (Mantidos Iguais)

Todos os componentes continuam funcionando:

```typescript
// src/components/Chat.tsx - SEM MUDANÇAS
// src/pages/gabinete/GerenciarAlertas.tsx - SEM MUDANÇAS
// Todos os outros componentes - SEM MUDANÇAS
```

## 🚀 Deploy do Frontend

### Opção 1: Railway Frontend

```bash
# Criar novo projeto Railway para frontend
railway new

# Configurar variáveis
railway variables set VITE_API_URL=https://your-backend.railway.app

# Deploy
railway up
```

### Opção 2: Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configurar variáveis no dashboard Vercel
# VITE_API_URL=https://your-backend.railway.app
```

### Opção 3: Netlify

```bash
# Build do projeto
npm run build

# Deploy no Netlify
# Upload da pasta dist/
# Configurar variáveis no dashboard
```

## 📡 Proxy de Desenvolvimento

Para desenvolvimento local, configure o proxy no `vite.config.ts`:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

## 🔧 Configuração CORS

O backend Railway já está configurado com CORS para aceitar requisições do frontend:

```typescript
// backend/src/index.ts (já configurado)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));
```

## 📊 Testando a Integração

### 1. Teste Health Check

```bash
# Frontend rodando em localhost:5173
# Backend rodando em localhost:3000 ou Railway URL

curl https://your-backend.railway.app/api/health
```

### 2. Teste de Integração

```typescript
// Adicione ao seu componente de teste
const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    console.log('Backend connected:', data);
  } catch (error) {
    console.error('Backend connection failed:', error);
  }
};
```

## 🔄 Fluxo de Desenvolvimento

### Desenvolvimento Local

1. **Backend Local**: `npm run dev` (porta 3000)
2. **Frontend Local**: `npm run dev` (porta 5173)
3. **Proxy**: Frontend proxy para backend local

### Staging/Produção

1. **Backend**: Deploy no Railway
2. **Frontend**: Deploy no Vercel/Netlify
3. **Configuração**: `VITE_API_URL` apontando para Railway

## 📋 Checklist de Migração

### Backend ✅
- [x] Estrutura Railway criada
- [x] Banco PostgreSQL configurado
- [x] APIs migradas (users, chat, alerts)
- [x] Health check implementado
- [x] CORS configurado
- [x] Variáveis de ambiente

### Frontend 🔄
- [ ] Atualizar API base URL
- [ ] Configurar variáveis de ambiente
- [ ] Testar integração local
- [ ] Deploy do frontend
- [ ] Configurar domínio (opcional)
- [ ] Testes end-to-end

## 🚨 Possíveis Problemas

### 1. CORS Errors
```bash
# Verificar se CORS_ORIGIN está correto no backend
railway variables set CORS_ORIGIN=https://your-frontend.com
```

### 2. 404 em Rotas SPA
```bash
# Configurar rewrites para SPAs
# Vercel: vercel.json
# Netlify: _redirects
```

### 3. Environment Variables
```bash
# Verificar se variáveis estão sendo carregadas
console.log(import.meta.env.VITE_API_URL);
```

## 📈 Monitoramento

### Frontend
- Vercel Analytics
- Netlify Analytics
- Google Analytics

### Backend
- Railway Logs
- Railway Metrics
- PostgreSQL Metrics

## 🔐 Segurança

### Headers de Segurança
```typescript
// Adicionar ao frontend se necessário
app.use(helmet());
```

### Environment Variables
```bash
# Nunca commitar secrets
.env
.env.local
.env.production
```

## 🌐 Domínios Personalizados

### Frontend
```bash
# Vercel
vercel domains add your-domain.com

# Netlify
# Dashboard > Domain management
```

### Backend
```bash
# Railway
railway domain add your-api.com
```

## 📝 Notas Importantes

1. **Zero Breaking Changes**: Todas as funcionalidades existem funcionam exatamente igual
2. **Mesma API**: Todos os endpoints mantêm a mesma estrutura
3. **Tipos Preservados**: Todos os tipos TypeScript são mantidos
4. **Hooks Iguais**: Todos os hooks React funcionam sem mudanças
5. **Componentes Iguais**: Nenhum componente precisa ser alterado

## 🤝 Suporte

Se encontrar problemas:
1. Verificar logs do Railway
2. Testar endpoints individualmente
3. Conferir variáveis de ambiente
4. Validar configuração CORS 