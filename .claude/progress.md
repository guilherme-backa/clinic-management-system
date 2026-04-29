# Session Progress Log

Arquivo atualizado pelo Claude a cada ação significativa.
Em caso de travamento, leia este arquivo para retomar de onde parou.

---

## Última sessão

**Data:** 2026-04-29

### Estado atual do projeto

**Branch:** main

**Estrutura:**
- `backend/src/common/` → base entity, enums, decorators, guards
- `backend/src/modules/auth/` → AuthModule (login, refresh, logout, JWT strategies)
- `backend/src/modules/users/` → UsersModule (CRUD)
- `backend/src/modules/workspaces/` → WorkspacesModule (CRUD + members)
- `backend/src/modules/establishments/` → EstablishmentsModule (CRUD + members + invitations entity)
- `backend/src/database/seeds/seed.ts` → Seed inicial (admin@clinic.com / Admin@123)

### Decisões técnicas confirmadas

- MySQL no HOST (localhost:3306 fora do Docker, host.docker.internal dentro)
- Redis em container (porta 6379)
- Backend e Frontend como imagens versionadas no Nexus local
- `synchronize: true` em desenvolvimento (TypeORM cria tabelas automaticamente)
- Polyfill de `globalThis.crypto` no `main.ts` para compatibilidade Node 18

### Concluído em 2026-04-29 (sessão atual)

- Implementados módulos: Auth, Users, Workspaces, Establishments
- Entidades criadas: User, Role, Session, Workspace, WorkspaceUser, Establishment, EstablishmentUser, Invitation
- Guards globais: JwtAuthGuard (global via APP_GUARD), RolesGuard
- Decorators: @CurrentUser(), @Roles(), @Public()
- Seed script: `DB_HOST=localhost npx ts-node -r tsconfig-paths/register src/database/seeds/seed.ts`
- Testado: login retorna accessToken + refreshToken, /users e /workspaces funcionando
- Backend compilado e rodando na porta 3002 (dev local) e 3000 (Docker)

### Como rodar localmente (dev)

```bash
cd /opt/clinic-management-system/backend
DB_HOST=localhost REDIS_HOST=localhost PORT=3002 \
  set -a && source /opt/clinic-management-system/.env && set +a && \
  DB_HOST=localhost REDIS_HOST=localhost PORT=3002 NODE_ENV=development \
  node dist/main.js
```

Ou com watch:
```bash
set -a && source /opt/clinic-management-system/.env && set +a
DB_HOST=localhost REDIS_HOST=localhost PORT=3002 NODE_ENV=development npm run start:dev
```

### Tabelas criadas no MySQL (via synchronize)

- users
- roles
- sessions
- workspaces
- workspace_users
- establishments
- establishment_users
- invitations

### Estrutura Docker (reorganizada em 2026-04-29)

```
docker-compose.yml          ← raiz, usa `include` para cada serviço
docker/
├── nexus/compose.yml
├── redis/compose.yml
├── backend/compose.yml
└── frontend-web/compose.yml
.env                        ← único .env unificado na raiz
```

- Portas configuráveis via .env: BACKEND_PORT, FRONTEND_PORT, REDIS_PORT
- Todos os serviços na rede `clinic_net` (bridge)
- Volume `redis_data` definido no compose.yml do redis e mergeado pelo root

### Próximos passos

1. **Módulos clínicos do backend:**
   - `animals` module (Owner + Animal entities + CRUD)
   - `appointments` module (Appointment + AppointmentService + Service entities + CRUD)
   - `medical-records` module (MedicalRecord + Prescription + Vaccination entities + CRUD)

2. **Build e deploy no Nexus:**
   - Rebuild imagem do backend após módulos clínicos
   - `cd /opt/clinic-management-system && bash scripts/build-push.sh`

3. **Frontend Web (Next.js):**
   - Páginas de autenticação (login)
   - Dashboard
   - CRUD de workspaces, establishments, users
   - Módulo clínico (owners, animals, appointments)

---

## Como usar este arquivo

Ao iniciar uma nova sessão após travamento, diga ao Claude:
> "leia o progress.md e me diga onde paramos"

O Claude vai ler `/opt/clinic-management-system/.claude/progress.md` e retomar de onde parou.
