# Tech Stack Recomendado

**Versão**: 1.0 | **Data**: 2026-04-28

---

## 🏗️ Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Web + Mobile)                  │
│  React/Next.js | React Native | TypeScript | TailwindCSS    │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
┌────────────────────────▼────────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER               │
│              Nginx / AWS ALB / CloudFlare                    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    BACKEND SERVICES                          │
│  Node.js/Express | NestJS | Docker | Kubernetes             │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │  Clinic      │  │  Admin       │      │
│  │  Service     │  │  Service     │  │  Service     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
         │               │               │
         ▼               ▼               ▼
    ┌────────────────────────────────────────┐
    │        BANCO DE DADOS                  │
    │  PostgreSQL 14+ | Redis | Elasticsearch│
    └────────────────────────────────────────┘
```

---

## 💻 Backend

### Linguagem & Runtime
- **Node.js**: 18 LTS ou superior
- **TypeScript**: Para type-safety
- **Versão**: node:18-alpine (Docker)

### Framework
- **Opção 1**: NestJS ⭐ (Recomendado)
  - Arquitetura modular
  - Built-in dependency injection
  - Excelente para escalabilidade
  - Suporte a microserviços
  
- **Opção 2**: Express.js
  - Simples e direto
  - Muitos middlewares disponíveis
  - Melhor para APIs pequenas

### Dependências Principais

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/typeorm": "^9.0.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.10.0",
    "redis": "^4.6.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "joi": "^17.0.0",
    "pino": "^8.0.0",
    "swagger-ui-express": "^4.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.0",
    "@types/bcrypt": "^5.0.0",
    "typescript": "^5.0.0",
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```

### Estrutura Backend

```
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── database.ts
│   ├── auth.ts
│   ├── redis.ts
│   └── jwt.ts
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── pipes/
│   ├── filters/
│   ├── interceptors/
│   └── middleware/
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.strategy.ts
│   │   └── dto/
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── entities/
│   ├── workspaces/
│   │   ├── workspaces.module.ts
│   │   ├── workspaces.controller.ts
│   │   ├── workspaces.service.ts
│   │   └── entities/
│   ├── establishments/
│   ├── animals/
│   ├── appointments/
│   └── medical-records/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── entities/
└── utils/
    ├── validators/
    ├── helpers/
    └── constants/
```

---

## 🗄️ Banco de Dados

### PostgreSQL
- **Versão**: 14 ou superior
- **Docker Image**: `postgres:14-alpine`
- **Portas**: 5432

### Client ORM
- **TypeORM** (Recomendado)
  - Suporte completo a PostgreSQL
  - Migrações automáticas
  - Query builder poderoso
  
```typescript
// Exemplo de Entidade
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @ManyToOne(() => Workspace)
  workspace: Workspace;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### Migrations
```bash
# Criar migration
npm run typeorm migration:create src/database/migrations/CreateUsersTable

# Executar migrations
npm run typeorm migration:run

# Reverter última migration
npm run typeorm migration:revert
```

---

## 🔐 Autenticação & Segurança

### JWT (JSON Web Tokens)
- **Tokens de Acesso**: 15 minutos
- **Tokens de Refresh**: 7 dias
- **Algorithm**: HS256

### Criptografia
- **Senhas**: bcrypt com salt 10
- **Dados Sensíveis**: AES-256 (se necessário)

```typescript
// Exemplo de serviço de autenticação
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password_hash)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
```

---

## 📦 Cache

### Redis
- **Versão**: 7.0+
- **Docker Image**: `redis:7-alpine`
- **Portas**: 6379

### Uso
- Sessions de usuário
- Cache de dados frequentes
- Rate limiting
- Jobs em background

```typescript
// Exemplo com Redis
constructor(private cacheManager: CacheManager) {}

async getCachedData(key: string) {
  let data = await this.cacheManager.get(key);
  if (!data) {
    data = await this.computeData();
    await this.cacheManager.set(key, data, 3600); // 1 hora
  }
  return data;
}
```

---

## 📝 Logging & Monitoring

### Logging
- **Pino**: Logger de alta performance
- **Winston**: Alternativa com mais funcionalidades

```typescript
// Logger com Pino
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});
```

### Monitoring
- **Prometheus**: Métricas de aplicação
- **Grafana**: Visualização de métricas
- **DataDog** ou **New Relic**: APM (opcional)

---

## 🧪 Testes

### Testes Unitários
- **Jest**: Framework de testes
- Cobertura: Mínimo 80%

```typescript
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should hash password correctly', async () => {
    const password = 'test123';
    const hash = await service.hashPassword(password);
    expect(await bcrypt.compare(password, hash)).toBe(true);
  });
});
```

### Testes de Integração
- **Supertest**: Para testar endpoints HTTP
- Banco de testes isolado

```typescript
describe('Auth Endpoints', () => {
  it('POST /auth/login should return access token', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });
});
```

---

## 🎨 Frontend

### Web
- **Framework**: Next.js 14+ (React 18+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query + Zustand
- **UI Components**: shadcn/ui + Radix UI

### Mobile
- **Framework**: React Native ⭐ (Recomendado) ou Flutter
- **Plataformas**: **Android** (10+) e **iOS** (15+)
- **Package Manager**: npm/yarn (React Native) ou pub (Flutter)
- **State Management**: Redux Toolkit ou Zustand

### Dependências Principais (Web)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-router": "^1.0.0",
    "zustand": "^4.0.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.0.0",
    "@headlessui/react": "^1.7.0",
    "lucide-react": "^0.0.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "vitest": "^1.0.0"
  }
}
```

### Estrutura Frontend

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── workspaces/page.tsx
│   │   ├── establishments/page.tsx
│   │   └── settings/page.tsx
│   └── clinic/
│       ├── animals/page.tsx
│       ├── appointments/page.tsx
│       └── medical-records/page.tsx
├── components/
│   ├── auth/
│   ├── layout/
│   ├── common/
│   └── forms/
├── hooks/
│   ├── useAuth.ts
│   ├── useWorkspace.ts
│   └── useFetch.ts
├── services/
│   ├── api.ts
│   ├── authService.ts
│   └── apiClient.ts
├── store/
│   ├── authStore.ts
│   ├── workspaceStore.ts
│   └── uiStore.ts
├── types/
│   ├── index.ts
│   ├── auth.ts
│   └── clinic.ts
├── utils/
│   ├── validators.ts
│   ├── formatters.ts
│   └── constants.ts
└── styles/
    ├── globals.css
    └── variables.css
```

---

## 🐳 Docker & DevOps

### Docker
```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: clinic_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/clinic_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3001:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Kubernetes
```yaml
apiVersion: v1
kind: Deployment
metadata:
  name: clinic-backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: backend
        image: clinic-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: clinic-secrets
              key: database-url
```

---

## 🚀 CI/CD

### GitHub Actions
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:cov

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t clinic-backend .
      - run: docker push clinic-backend
```

---

## 📊 APIs & Documentação

### Swagger/OpenAPI
```bash
npm install @nestjs/swagger swagger-ui-express
```

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Clinic Management API')
  .setDescription('API para gerenciar clínicas veterinárias')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

---

## 📋 Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL 14+ instalado
- [ ] Redis 7+ instalado
- [ ] Docker & Docker Compose
- [ ] Git configurado
- [ ] Editor (VS Code recomendado)
- [ ] Extensões: ESLint, Prettier, Thunder Client

---

**Versão**: 1.1 | **Última atualização**: 2026-04-28
