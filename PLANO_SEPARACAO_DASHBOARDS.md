# Plano de Separação de Dashboards - DigiUrban2

## 🎯 Conceito Principal

Separar completamente as experiências de **Servidores Públicos** e **Cidadãos**, criando dois sistemas distintos e independentes para resolver definitivamente os problemas de autenticação complexa.

---

## 🔄 Estrutura Atual vs Nova Estrutura

### ❌ **Estrutura Atual (Problemática)**
```
Login Único → Dashboard Universal → Menu baseado em permissões
```
- **Problemas**: Complexidade de autenticação, RLS complexo, menu confuso
- **Resultado**: Dificuldades técnicas e UX não otimizada

### ✅ **Nova Estrutura (Proposta)**
```
Landing Page → Dois Portais Separados
├── Portal Administrativo (Servidores/Prefeito)
└── Portal do Cidadão (Público)
```

---

## 🏛️ Portal Administrativo (Servidores e Prefeito)

### 🔐 **Autenticação**
- **URL**: `/admin/login`
- **Credenciais**: Login + senha corporativa
- **Usuários**: Prefeito, Secretários, Diretores, Coordenadores, Funcionários, Atendentes
- **Registro**: Apenas administradores podem criar contas

### 📊 **Dashboard Administrativo**
- **URL Base**: `/admin/`
- **Layout**: Sidebar completa + Navegação hierárquica
- **Funcionalidades**:
  - Visão executiva (KPIs, métricas, alertas)
  - Gerenciamento de secretarias
  - Relatórios executivos
  - Workflow de aprovação
  - Comunicação interna
  - Gestão de protocolos
  - Configurações do sistema

### 🏢 **Módulos Setoriais**
```
/admin/gabinete/          → Gabinete do Prefeito
/admin/saude/             → Secretaria de Saúde
/admin/educacao/          → Secretaria de Educação
/admin/assistencia/       → Assistência Social
/admin/obras/             → Obras Públicas
/admin/meio-ambiente/     → Meio Ambiente
... [todos os outros módulos]
```

### 👥 **Hierarquia de Acesso**
- **Super Admin** (Prefeito): Acesso total
- **Admin** (Chefe Gabinete): Área administrativa
- **Secretário**: Sua secretaria + relatórios
- **Diretor**: Sua área específica
- **Coordenador**: Coordenação setorial
- **Funcionário**: Operações básicas
- **Atendente**: Atendimento público

---

## 👥 Portal do Cidadão (Público)

### 🔐 **Autenticação**
- **URL**: `/cidadao/login`
- **Credenciais**: CPF/Email + senha pessoal
- **Registro**: Auto-registro público
- **Recuperação**: Por email/SMS

### 🏠 **Dashboard do Cidadão**
- **URL Base**: `/cidadao/`
- **Layout**: Interface simplificada e intuitiva
- **Funcionalidades**:
  - Serviços municipais
  - Acompanhamento de protocolos
  - Documentos pessoais
  - Agendamentos
  - Consultas públicas
  - Ouvidoria
  - Informações municipais

### 🛠️ **Serviços Disponíveis**
```
/cidadao/servicos/          → Catálogo de Serviços
/cidadao/protocolos/        → Meus Protocolos
/cidadao/documentos/        → Documentos Pessoais
/cidadao/agendamentos/      → Agendamentos
/cidadao/avaliacoes/        → Avaliações de Serviços
/cidadao/noticias/          → Notícias Municipais
/cidadao/transparencia/     → Portal da Transparência
```

### 📱 **Características Especiais**
- **Mobile-first**: Otimizado para smartphones
- **Offline support**: Funcionalidades básicas offline
- **Notificações**: SMS/Email para atualizações
- **Acessibilidade**: WCAG 2.1 completo
- **PWA**: Instalável como app

---

## 🔀 Fluxo de Navegação

### 🏠 **Landing Page** (`/`)
```
DigiUrban2 - Gestão Municipal Inteligente
├── 🏛️ [Portal Administrativo] → /admin/login
├── 👥 [Portal do Cidadão] → /cidadao/login
├── 📋 [Transparência] → /transparencia
└── ℹ️ [Sobre a Cidade] → /sobre
```

### 🏛️ **Fluxo Administrativo**
```
/admin/login → /admin/dashboard → /admin/[modulo]/[funcionalidade]
```

### 👥 **Fluxo do Cidadão**
```
/cidadao/login → /cidadao/dashboard → /cidadao/[servico]
```

---

## 🛠️ Implementação Técnica

### 📁 **Estrutura de Pastas**
```
src/
├── pages/
│   ├── landing/              # Landing page
│   ├── admin/                # Portal administrativo
│   │   ├── auth/            # Login administrativo
│   │   ├── dashboard/       # Dashboard administrativo
│   │   ├── gabinete/        # Módulo gabinete
│   │   ├── saude/           # Módulo saúde
│   │   └── ...              # Outros módulos
│   ├── cidadao/             # Portal do cidadão
│   │   ├── auth/            # Login cidadão
│   │   ├── dashboard/       # Dashboard cidadão
│   │   ├── servicos/        # Serviços
│   │   └── protocolos/      # Protocolos
│   └── shared/              # Páginas compartilhadas
├── components/
│   ├── admin/               # Componentes administrativos
│   ├── cidadao/            # Componentes do cidadão
│   └── shared/             # Componentes compartilhados
└── lib/
    ├── admin-auth.ts       # Autenticação administrativa
    ├── cidadao-auth.ts     # Autenticação cidadão
    └── shared.ts           # Utilitários compartilhados
```

### 🔐 **Sistemas de Autenticação Separados**

#### **Admin Auth** (`admin-auth.ts`)
```typescript
- Tabela: admin_users
- Campos: email, senha, tipo_usuario, secretaria_id
- Sessão: admin_session (localStorage)
- Permissões: Baseadas em hierarquia
```

#### **Cidadão Auth** (`cidadao-auth.ts`)
```typescript
- Tabela: cidadao_users
- Campos: cpf, email, senha, nome_completo
- Sessão: cidadao_session (localStorage)
- Permissões: Serviços públicos apenas
```

### 🛣️ **Roteamento Separado**
```typescript
// App.tsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  
  {/* Portal Administrativo */}
  <Route path="/admin/*" element={<AdminApp />} />
  
  {/* Portal do Cidadão */}
  <Route path="/cidadao/*" element={<CidadaoApp />} />
  
  {/* Páginas Públicas */}
  <Route path="/transparencia" element={<Transparencia />} />
</Routes>
```

---

## 🎯 Vantagens da Separação

### ✅ **Técnicas**
- **Autenticação simplificada**: Cada portal com sua lógica
- **Performance melhor**: Bundles menores e especializados
- **Manutenção facilitada**: Código organizado por contexto
- **Escalabilidade**: Pode ser deployado separadamente
- **Segurança**: Isolamento total entre contextos

### ✅ **UX/UI**
- **Interface otimizada**: Cada público tem sua experiência
- **Navigation clara**: Sem confusão de permissões
- **Mobile-first**: Portal cidadão otimizado para mobile
- **Onboarding específico**: Guias para cada tipo de usuário
- **Performance percebida**: Carregamento mais rápido

### ✅ **Negócio**
- **Adoção facilitada**: Usuários encontram o que precisam
- **Treinamento simplificado**: Menos complexidade
- **Transparência**: Cidadãos têm portal dedicado
- **Governança**: Separação clara de responsabilidades

---

## 📋 Cronograma de Implementação

### **Fase 1: Preparação** (1 semana)
- [ ] Criar estrutura de pastas separadas
- [ ] Duplicar sistema de autenticação
- [ ] Criar landing page nova
- [ ] Configurar roteamento separado

### **Fase 2: Portal Administrativo** (2 semanas)
- [ ] Migrar dashboard atual para `/admin/`
- [ ] Implementar autenticação administrativa
- [ ] Ajustar menus e navegação
- [ ] Testes com usuários administrativos

### **Fase 3: Portal do Cidadão** (2 semanas)
- [ ] Criar dashboard do cidadão
- [ ] Implementar serviços básicos
- [ ] Sistema de protocolos para cidadãos
- [ ] Interface mobile-first

### **Fase 4: Polimento** (1 semana)
- [ ] Ajustes visuais e UX
- [ ] Testes de usabilidade
- [ ] Documentação
- [ ] Deploy e validação

---

## 🔍 Comparativo: Antes vs Depois

| Aspecto | ❌ Antes (Atual) | ✅ Depois (Proposto) |
|---------|------------------|----------------------|
| **Login** | Sistema único complexo | Dois sistemas simples |
| **Menu** | Baseado em permissões | Específico por contexto |
| **Performance** | Bundle único grande | Bundles especializados |
| **UX** | Confusa para cidadãos | Otimizada por público |
| **Manutenção** | Código emaranhado | Separação clara |
| **Autenticação** | RPC + GoTrue complexo | Consultas SQL diretas |
| **Mobile** | Adaptação forçada | Design mobile-first |
| **Onboarding** | Único para todos | Específico por tipo |

---

## 🎯 Resultado Esperado

### 🏛️ **Para Administradores**
- Dashboard executivo profissional
- Acesso rápido às ferramentas administrativas
- Workflow otimizado por secretaria
- Relatórios e KPIs em tempo real

### 👥 **Para Cidadãos**
- Portal intuitivo e fácil de usar
- Acesso mobile aos serviços municipais
- Acompanhamento transparente de protocolos
- Experiência similar a apps de banco/governo

### 🏢 **Para a Prefeitura**
- Sistema robusto e escalável
- Manutenção simplificada
- Maior adoção pelos usuários
- Transparência e modernização

---

## 💡 Conclusão

A separação em dois portais distintos resolve simultaneamente:

1. **Problemas técnicos**: Autenticação complexa, RLS, performance
2. **Problemas de UX**: Menu confuso, interface não otimizada
3. **Problemas de manutenção**: Código emaranhado, dependências complexas

**Esta abordagem transforma o DigiUrban2 de um sistema complexo em duas aplicações especializadas e eficientes.**

---

*Documento criado em ${new Date().toLocaleDateString('pt-BR')} - Proposta de reestruturação do DigiUrban2*