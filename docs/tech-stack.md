# Tech Stack

**Versão**: 1.1 | **Data**: 2026-04-28

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Web + Mobile)                    │
│         Next.js/React (Web) | Flutter/Dart (Mobile)         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS/REST API
┌────────────────────────▼────────────────────────────────────┐
│                   API GATEWAY / REVERSE PROXY                │
│                      Nginx / CloudFlare                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│            MONÓLITO MODULAR (NestJS / Node.js)               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   auth/      │  │  clinic/     │  │  workspace/  │      │
│  │  (módulo)    │  │  (módulo)    │  │  (módulo)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │
    ┌────────────────────▼───────────────────────┐
    │        BANCO DE DADOS / CACHE              │
    │       PostgreSQL 14+ | Redis 7+            │
    └────────────────────────────────────────────┘
```

---

## Backend

### Linguagem & Runtime
- **Node.js**: 18 LTS ou superior
- **TypeScript**: para type-safety
- **Docker image**: `node:18-alpine`

### Framework
- **NestJS** — arquitetura modular, dependency injection, suporte a microserviços no futuro

### Dependências principais

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/typeorm": "^9.0.0",
    "@nestjs/swagger": "^7.0.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.10.0",
    "redis": "^4.6.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "pino": "^8.0.0",
    "swagger-ui-express": "^4.6.0"
  },
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "supertest": "^6.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/parser": "^6.0.0"
  }
}
```

### Estrutura de pastas

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── pipes/
│   │   └── filters/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── workspaces/
│   │   ├── establishments/
│   │   ├── animals/
│   │   ├── appointments/
│   │   └── medical-records/
│   └── database/
│       ├── migrations/
│       └── seeds/
└── test/
```

---

## Banco de Dados

- **PostgreSQL 14+** — banco principal
- **Redis 7+** — cache, sessões, rate limiting
- **ORM**: TypeORM com migrations versionadas

---

## Autenticação

- JWT (access token 15min, refresh token 7 dias)
- bcrypt para senhas (salt 10)
- Rate limiting via Redis (login: 10 tentativas / 15min por IP)

---

## Frontend Web

- **Framework**: Next.js 14+ (React 18+)
- **Linguagem**: TypeScript
- **Estilo**: Tailwind CSS
- **Componentes**: shadcn/ui + Radix UI
- **Estado**: TanStack Query + Zustand
- **Formulários**: React Hook Form + Zod
- **HTTP**: Axios

### Estrutura de pastas

```
frontend-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── clinic/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── utils/
└── public/
```

---

## Mobile (Flutter / Dart)

### Decisão
**Flutter com Dart** é a escolha definitiva para o app mobile nativo (Android e iOS).

Motivações:
- único codebase para Android e iOS com performance nativa;
- widgets ricos adequados para formulários clínicos, calendários e listas complexas;
- hot reload acelera o ciclo de desenvolvimento;
- ecossistema maduro com pub.dev;
- compilação AOT garante desempenho próximo ao nativo.

### Versões
- **Flutter**: 3.19+ (stable channel)
- **Dart**: 3.3+

### Dependências principais (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter

  # HTTP e API
  dio: ^5.4.0
  retrofit: ^4.1.0

  # Estado
  flutter_bloc: ^8.1.4
  equatable: ^2.0.5

  # Navegação
  go_router: ^13.2.0

  # Armazenamento local
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.2.3
  sqflite: ^2.3.2

  # UI e componentes
  material_design_icons_flutter: ^7.0.7296
  cached_network_image: ^3.3.1
  intl: ^0.19.0
  flutter_localizations:
    sdk: flutter

  # Formulários e validação
  reactive_forms: ^17.0.0

  # Autenticação
  local_auth: ^2.2.0          # biometria
  jwt_decoder: ^2.0.1

  # Utilitários
  get_it: ^7.6.7              # injeção de dependência
  injectable: ^2.3.2
  freezed_annotation: ^2.4.1
  json_annotation: ^4.8.1
  dartz: ^0.10.1              # Either / Option para tratamento de erros

dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  mockito: ^5.4.4
  build_runner: ^2.4.8
  freezed: ^2.4.7
  json_serializable: ^6.7.1
  injectable_generator: ^2.4.1
  retrofit_generator: ^8.1.0
  flutter_lints: ^3.0.1
```

### Arquitetura Mobile (Clean Architecture)

```
mobile/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart
│   │   └── router/
│   │       └── app_router.dart
│   ├── core/
│   │   ├── di/                    # injeção de dependência
│   │   ├── error/                 # failures e exceptions
│   │   ├── network/               # cliente HTTP (Dio)
│   │   ├── storage/               # local storage
│   │   └── utils/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── datasources/
│   │   │   │   ├── models/
│   │   │   │   └── repositories/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── usecases/
│   │   │   └── presentation/
│   │   │       ├── bloc/
│   │   │       ├── pages/
│   │   │       └── widgets/
│   │   ├── dashboard/
│   │   ├── animals/
│   │   ├── appointments/
│   │   ├── medical_records/
│   │   └── settings/
│   └── shared/
│       ├── theme/
│       ├── widgets/
│       └── extensions/
├── test/
│   ├── unit/
│   ├── widget/
│   └── helpers/
├── integration_test/
│   └── app_test.dart
├── android/
├── ios/
└── pubspec.yaml
```

### Padrão de estado: BLoC

```dart
// Exemplo de BLoC para autenticação
@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase _loginUseCase;

  AuthBloc(this._loginUseCase) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final result = await _loginUseCase(
      LoginParams(email: event.email, password: event.password),
    );
    result.fold(
      (failure) => emit(AuthFailure(failure.message)),
      (token)   => emit(AuthSuccess(token)),
    );
  }
}
```

### Navegação: GoRouter

```dart
final appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(path: '/login',     builder: (_, __) => const LoginPage()),
    GoRoute(path: '/dashboard', builder: (_, __) => const DashboardPage()),
    GoRoute(path: '/animals',   builder: (_, __) => const AnimalsPage()),
    GoRoute(
      path: '/animals/:id',
      builder: (_, state) => AnimalDetailPage(id: state.pathParameters['id']!),
    ),
    GoRoute(path: '/appointments', builder: (_, __) => const AppointmentsPage()),
  ],
);
```

### Comunicação com a API

```dart
// Cliente Dio configurado
@lazySingleton
class ApiClient {
  late final Dio dio;

  ApiClient(this._storage) {
    dio = Dio(BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 30),
    ));
    dio.interceptors.add(AuthInterceptor(_storage));
  }
}

// Interceptor JWT com refresh automático
class AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.read(key: 'access_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}
```

### Testes Mobile

```bash
# Unitários e de widget
flutter test

# Com cobertura
flutter test --coverage

# Integração (emulador necessário)
flutter test integration_test/app_test.dart
```

### Setup Flutter no Linux (Android)

```bash
# 1. Baixar Flutter SDK
cd ~/development
git clone https://github.com/flutter/flutter.git -b stable

# 2. Adicionar ao PATH
export PATH="$PATH:$HOME/development/flutter/bin"

# 3. Verificar dependências
flutter doctor

# 4. Android Studio com plugin Flutter
# Plugins: Flutter + Dart

# 5. Criar emulador no Android Studio
# Device Manager → Create Virtual Device → Pixel 7 → API 34

# 6. Rodar o app
cd mobile
flutter run
```

---

## Docker Compose (ambiente local completo)

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
      JWT_SECRET: change-me-in-production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend/src:/app/src

  frontend-web:
    build: ./frontend-web
    ports:
      - "3001:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## CI/CD (GitHub Actions)

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm run lint
      - run: cd backend && npm run test:cov

  frontend-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: cd frontend-web && npm ci
      - run: cd frontend-web && npm run lint
      - run: cd frontend-web && npm run test

  mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.19.0'
          channel: stable
      - run: cd mobile && flutter pub get
      - run: cd mobile && flutter analyze
      - run: cd mobile && flutter test --coverage
```

> Build de release iOS requer runner macOS (via GitHub Actions ou serviço dedicado).

---

## Logging e Monitoramento

- **Backend**: Pino (structured JSON logs)
- **Monitoramento**: Prometheus + Grafana
- **APM (opcional)**: DataDog ou New Relic

---

## Checklist de Setup Local

- [ ] Node.js 18+ instalado
- [ ] Docker e Docker Compose instalados
- [ ] Flutter SDK 3.19+ instalado (stable channel)
- [ ] Android Studio instalado com plugins Flutter e Dart
- [ ] Emulador Android configurado (Pixel 7, API 34)
- [ ] `flutter doctor` sem erros críticos
- [ ] VS Code com extensões: ESLint, Prettier, Flutter, Dart
- [ ] Git configurado com SSH

---

**Versão**: 1.1 | **Última atualização**: 2026-04-28
