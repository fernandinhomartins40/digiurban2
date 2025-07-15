# DigiUrban Backend - Railway

Backend API do Sistema Municipal DigiUrban otimizado para deploy no Railway.

## 🚀 Tecnologias

- **Node.js** + **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados (Railway PostgreSQL)
- **Railway** - Plataforma de deploy

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── database/
│   │   ├── db.ts           # Configuração do banco
│   │   └── schema.sql      # Schema completo
│   ├── routes/
│   │   ├── health.ts       # Health check
│   │   ├── users.ts        # Gestão de usuários
│   │   ├── chat.ts         # Sistema de chat
│   │   └── alerts.ts       # Sistema de alertas
│   ├── types/
│   │   ├── auth.ts         # Tipos de autenticação
│   │   ├── chat.ts         # Tipos do chat
│   │   └── alerts.ts       # Tipos de alertas
│   └── index.ts            # Servidor principal
├── package.json
├── tsconfig.json
├── railway.json            # Configuração Railway
└── .env.example            # Variáveis de ambiente
```

## 🔧 Funcionalidades Implementadas

### Sistema de Usuários
- GET `/api/users` - Listar usuários
- POST `/api/users` - Criar usuário

### Sistema de Chat
- GET `/api/chat/rooms` - Listar salas de chat
- GET `/api/chat/rooms/:id/messages` - Mensagens da sala
- POST `/api/chat/rooms/:id/messages` - Enviar mensagem
- POST `/api/chat/rooms` - Criar nova sala
- PATCH `/api/chat/rooms/:roomId/messages/:messageId/read` - Marcar como lida

### Sistema de Alertas
- GET `/api/alerts/categories` - Categorias de alertas
- GET `/api/alerts/alerts` - Listar alertas (com filtros)
- POST `/api/alerts/alerts` - Criar alerta
- GET `/api/alerts/my-alerts` - Alertas do usuário
- PATCH `/api/alerts/alerts/:id/read` - Marcar como lida
- GET `/api/alerts/statistics` - Estatísticas

### Health Check
- GET `/api/health` - Status do servidor e banco

## 🗄️ Banco de Dados

### Tabelas Principais

#### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Chat System
- `chat_rooms` - Salas de chat
- `chat_participants` - Participantes das salas
- `chat_messages` - Mensagens
- `chat_message_reactions` - Reações às mensagens

#### Alert System
- `alert_categories` - Categorias de alertas
- `citizen_alerts` - Alertas principais
- `alert_recipients` - Destinatários
- `alert_delivery_stats` - Estatísticas de entrega

## 🔐 Variáveis de Ambiente

```bash
# Database (Railway PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Server Configuration
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com

# JWT Configuration (para autenticação futura)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Email Configuration (para notificações)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload (para anexos)
UPLOAD_MAX_SIZE=10mb
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,application/pdf
```

## 🚀 Deploy no Railway

### 1. Configuração Inicial
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login no Railway
railway login

# Criar novo projeto
railway new
```

### 2. Configurar PostgreSQL
```bash
# Adicionar PostgreSQL ao projeto
railway add postgresql

# Obter URL do banco
railway variables
```

### 3. Configurar Variáveis
```bash
# Definir variáveis de ambiente
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://your-frontend.com
railway variables set JWT_SECRET=your-secret-key
```

### 4. Deploy
```bash
# Deploy automático via Git
git push origin main

# Ou deploy manual
railway up
```

## 📡 Endpoints da API

### Health Check
```bash
GET /api/health
```

### Usuários
```bash
GET /api/users
POST /api/users
```

### Chat
```bash
GET /api/chat/rooms
GET /api/chat/rooms/:id/messages
POST /api/chat/rooms/:id/messages
POST /api/chat/rooms
```

### Alertas
```bash
GET /api/alerts/categories
GET /api/alerts/alerts
POST /api/alerts/alerts
GET /api/alerts/my-alerts
PATCH /api/alerts/alerts/:id/read
GET /api/alerts/statistics
```

## 🔄 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar banco PostgreSQL local
createdb digiurban

# Copiar variáveis de ambiente
cp .env.example .env

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 📊 Monitoramento

O Railway fornece logs e métricas automaticamente:
- Logs em tempo real
- Métricas de CPU/RAM
- Monitoramento de banco
- Alertas de erro

## 🔧 Troubleshooting

### Erro de Conexão com Banco
```bash
# Verificar variáveis
railway variables

# Verificar logs
railway logs

# Reconectar banco
railway link
```

### Erro de Build
```bash
# Limpar cache
npm run build:clean

# Verificar dependências
npm install --legacy-peer-deps
```

## 🚀 Próximos Passos

1. **Autenticação JWT** - Implementar login/logout
2. **File Upload** - Sistema de anexos
3. **WebSocket** - Chat em tempo real
4. **Push Notifications** - Alertas instantâneos
5. **API Rate Limiting** - Controle de acesso
6. **Testes** - Cobertura de testes
7. **Swagger** - Documentação da API

## 📝 Logs e Debug

```bash
# Logs do Railway
railway logs

# Logs em tempo real
railway logs --tail

# Logs de uma função específica
railway logs --filter "function_name"
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes. 