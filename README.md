# 📝 Notes App

Clone do Apple Notes desenvolvido com arquitetura de monorepo, oferecendo uma experiência completa para criação, organização e gerenciamento de notas com suporte a categorias (pastas) e edição em Markdown.

## 🚀 Tecnologias

### Backend (API)

- **[Bun](https://bun.sh)** - Runtime JavaScript ultra-rápido
- **[Elysia](https://elysiajs.com)** - Framework web minimalista e performático
- **[MongoDB](https://www.mongodb.com)** - Banco de dados NoSQL
- **[Mongoose](https://mongoosejs.com)** - ODM para MongoDB
- **[Eden Treaty](https://elysiajs.com/eden/treaty/)** - Cliente type-safe para Elysia

### Frontend (Web)

- **[Next.js 16](https://nextjs.org)** - Framework React com App Router
- **[React 19](https://react.dev)** - Biblioteca UI
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado servidor
- **[TypeScript](https://www.typescriptlang.org)** - Tipagem estática
- **[Tailwind CSS](https://tailwindcss.com)** - Framework CSS utilitário
- **[shadcn/ui](https://ui.shadcn.com)** - Componentes UI acessíveis
- **[Sonner](https://sonner.emilkowal.ski)** - Sistema de notificações
- **[React Markdown](https://remarkjs.github.io/react-markdown)** - Renderização de Markdown

## 📁 Estrutura do Projeto

```
notes/
├── apps/
│   ├── api/              # Backend API (Elysia + Bun)
│   │   └── src/
│   │       ├── routes/    # Rotas da API
│   │       ├── services/  # Lógica de negócio
│   │       ├── models/    # Modelos Mongoose
│   │       └── db/        # Configuração do banco
│   │
│   └── web/              # Frontend (Next.js)
│       ├── app/          # App Router do Next.js
│       ├── components/   # Componentes React
│       ├── hooks/        # Custom hooks (useNotes, useCategories)
│       ├── lib/          # Utilitários
│       └── providers/    # Providers React
│
├── docker-compose.yml    # Configuração MongoDB
└── package.json          # Workspace root
```

## 🛠️ Pré-requisitos

- **[Bun](https://bun.sh)** >= 1.0.0
- **[Docker](https://www.docker.com)** e Docker Compose (para MongoDB)
- **Node.js** >= 18 (opcional, se não usar Bun)

## 📦 Instalação

1. **Clone o repositório:**

```bash
git clone <repository-url>
cd notes
```

2. **Instale as dependências:**

```bash
bun install
```

3. **Inicie o MongoDB com Docker:**

```bash
bun run docker:up
```

Ou manualmente:

```bash
docker-compose up -d
```

## 🚀 Executando o Projeto

### Desenvolvimento

**Executar API e Web simultaneamente:**

```bash
bun run dev:all
```

**Executar apenas a API:**

```bash
bun run dev
# ou
cd apps/api && bun run dev
```

**Executar apenas o Web:**

```bash
bun run dev:web
# ou
cd apps/web && bun run dev
```

### URLs de Desenvolvimento

- **API:** http://localhost:3000
- **Web:** http://localhost:3001 (ou porta configurada no Next.js)
- **MongoDB:** mongodb://localhost:27017

## 📚 Scripts Disponíveis

### Root

- `bun run dev` - Inicia apenas a API
- `bun run dev:web` - Inicia apenas o frontend
- `bun run dev:all` - Inicia API e frontend em paralelo
- `bun run docker:up` - Inicia containers Docker
- `bun run docker:down` - Para containers Docker
- `bun run docker:logs` - Visualiza logs dos containers
- `bun run test` - Executa testes
- `bun run test:connection` - Testa conexão com MongoDB

## 🎯 Funcionalidades

### Notas

- ✅ Criar, editar e deletar notas
- ✅ Editor Markdown com preview em tempo real
- ✅ Busca por título e conteúdo
- ✅ Organização por categorias (pastas)
- ✅ Contagem de notas por categoria

### Categorias (Pastas)

- ✅ Criar, renomear e deletar categorias
- ✅ Visualização apenas de categorias com notas
- ✅ Contagem automática de notas por categoria
- ✅ Filtro de notas por categoria

### Interface

- ✅ Design moderno e responsivo
- ✅ Tema dark
- ✅ Notificações toast para feedback
- ✅ Estados de loading
- ✅ Tratamento de erros

## 🔌 API Endpoints

### Notas

- `GET /notes` - Lista todas as notas
- `GET /notes/:id` - Busca nota por ID
- `POST /notes` - Cria nova nota
- `PUT /notes/:id` - Atualiza nota
- `DELETE /notes/:id` - Deleta nota

### Categorias

- `GET /categories` - Lista todas as categorias
- `GET /categories/:id` - Busca categoria por ID
- `POST /categories` - Cria nova categoria
- `PUT /categories/:id` - Atualiza categoria
- `DELETE /categories/:id` - Deleta categoria

## 🗄️ Banco de Dados

O projeto utiliza MongoDB com os seguintes modelos:

### Note

```typescript
{
  title: string;
  content: string;
  category: ObjectId (ref: Category);
  createdAt: Date;
  updatedAt: Date;
}
```

### Category

```typescript
{
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Configuração

### Variáveis de Ambiente

**API (`apps/api`):**

```env
MONGO_URI=mongodb://localhost:27017/elysia_demo
URL_DOMAIN=localhost:3000
```

**Web (`apps/web`):**

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🧪 Testes

```bash
# Executar todos os testes
bun run test

# Configurar ambiente de teste
bun run test:setup

# Limpar ambiente de teste
bun run test:cleanup

# Testar conexão com MongoDB
bun run test:connection
```

## 📝 Desenvolvimento

### Adicionando Novas Funcionalidades

1. **Backend:**

   - Adicione rotas em `apps/api/src/routes/`
   - Implemente serviços em `apps/api/src/services/`
   - Crie modelos em `apps/api/src/models/`

2. **Frontend:**
   - Crie hooks customizados em `apps/web/hooks/`
   - Adicione componentes em `apps/web/components/`
   - Configure providers em `apps/web/providers/`

### Hooks Disponíveis

- `useNotes()` - Gerenciamento de notas
- `useCategories()` - Gerenciamento de categorias

Ambos os hooks incluem:

- Queries para listagem e busca
- Mutations para CRUD
- Estados de loading
- Tratamento de erros
- Notificações automáticas

## 🐳 Docker

O projeto inclui configuração Docker Compose para MongoDB:

```bash
# Iniciar MongoDB
docker-compose up -d

# Parar MongoDB
docker-compose down

# Ver logs
docker-compose logs -f
```

## 📄 Licença

Este projeto é privado.

## 👥 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 🙏 Agradecimentos

- [Elysia](https://elysiajs.com) pela excelente framework
- [shadcn](https://ui.shadcn.com) pelos componentes UI
- [Bun](https://bun.sh) pelo runtime incrível

---

Desenvolvido com ❤️ usando Bun, Elysia e Next.js
