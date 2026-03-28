# Anna — Monorepo

Monorepo full-stack pour un site vitrine et un backoffice de gestion, dans le domaine de l'ostéopathie animalière.

## Structure

```
anna-mono/
├── apps/
│   ├── backend/       # API REST (Express.js)
│   ├── frontend/      # Site vitrine (Next.js)
│   └── backoffice/    # Dashboard admin (Next.js)
├── packages/
│   ├── ui/            # Bibliothèque de composants partagés
│   ├── app-types/     # Types TypeScript partagés
│   ├── utils/         # Fonctions utilitaires partagées
│   └── typescript-config/  # tsconfig de base
├── docker-compose.deps.yaml  # PostgreSQL + Redis (dev)
└── docker-compose.yaml       # Stack complète (prod)
```

## Stack

| | Tech |
|---|---|
| Monorepo | Turborepo + pnpm |
| Linting/Formatting | Biome |
| Backend | Express 5, Prisma 7, PostgreSQL 17, Redis 8 |
| Frontend / Backoffice | Next.js 16, React 19, Tailwind CSS 4 |
| Cartographie | Deck.gl, Mapbox GL, MapTiler, Turf.js |
| Composants UI | Radix UI, Lucide React, Motion |
| Tests | Vitest |

## Prérequis

- Node.js ≥ 18
- pnpm ≥ 10
- Docker & Docker Compose

## Installation

```bash
pnpm install
```

## Variables d'environnement

**`apps/backend/.env`**
```env
NODE_ENV=development
PORT=8080
CORS_ORIGIN=http://localhost:3000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=db
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

REDIS_HOST=localhost
REDIS_PORT=6379

COMMON_RATE_LIMIT_WINDOW_MS=900000
COMMON_RATE_LIMIT_MAX_REQUESTS=20
```

**`apps/frontend/.env.local`** et **`apps/backoffice/.env.local`**
```env
NEXT_PUBLIC_MAPTILER_API_KEY=<your_maptiler_key>
API_URL=http://localhost:8080
```

## Développement

Démarrer PostgreSQL et Redis :
```bash
pnpm deps:up
```

Appliquer les migrations et générer le client Prisma :
```bash
cd apps/backend
pnpm prisma:migrate
pnpm prisma:generate
```

Lancer toutes les apps en parallèle :
```bash
pnpm dev
```

| App | URL |
|---|---|
| Backend API | http://localhost:8080 |
| Frontend | http://localhost:3000 |
| Backoffice | http://localhost:3001 |

Pour lancer une app spécifique :
```bash
pnpm dev --filter=backend
pnpm dev --filter=frontend
pnpm dev --filter=backoffice
```

## Commandes disponibles

```bash
pnpm build        # Build de toutes les apps
pnpm lint         # Vérification du code
pnpm lint:fix     # Correction automatique
pnpm format       # Formatage
pnpm check-types  # Vérification des types TypeScript
```

## Tests

```bash
cd apps/backend
pnpm test         # Tests unitaires + intégration
pnpm test:cov     # Avec couverture de code
```

> Les tests reset la base de données et la re-seede automatiquement avant chaque run.

## Arrêt des dépendances

```bash
pnpm deps:down    # Arrêter les conteneurs
pnpm deps:clean   # Arrêter et supprimer les volumes
```

## CI / Intégration Continue

Deux workflows GitHub Actions principaux, déclenchés sur chaque push et pull request vers `main`.

### `ci.yml` — Qualité de code

Les jobs tournent en parallèle. Le job `build` final n'est lancé que si tous les autres passent.

| Job | Outil | Rôle |
|---|---|---|
| **Lint** | [Biome](https://biomejs.dev) | Vérifie les règles de style et les bonnes pratiques TypeScript/JS |
| **Type Check** | TypeScript | Vérifie les types statiquement sur tout le monorepo |
| **Backend Tests** | [Vitest](https://vitest.dev) | Tests unitaires et d'intégration avec vraie base PostgreSQL + Redis. Bloque si la couverture passe sous **75 %** |
| **Dead Code** | [knip](https://knip.dev) | Détecte les exports, fichiers et dépendances non utilisés dans le monorepo |
| **Bundle Size** | [size-limit](https://github.com/ai/size-limit) | Surveille la taille du bundle JS du frontend. Bloque si le bundle dépasse le seuil configuré dans `apps/frontend/.size-limit.json` (actuellement **3400 kB**) |
| **Build** | Turbo | Build de toutes les apps |

### `security.yml` — Sécurité

Tourne sur chaque push/PR **et** tous les lundis à 8h UTC (pour détecter de nouvelles CVEs sur du code non modifié).

| Job | Outil | Rôle |
|---|---|---|
| **OSV Scanner** | [osv-scanner](https://google.github.io/osv-scanner/) | Scanne `pnpm-lock.yaml` contre plusieurs bases de CVEs agrégées (GitHub Advisory DB, NVD, OSV.dev). Plus exhaustif que `pnpm audit` seul. Bloque sur toute vulnérabilité détectée. |
| **Secrets** | [gitleaks](https://gitleaks.io) | Analyse le code et l'historique git pour détecter des secrets hardcodés — clés API, tokens JWT, mots de passe. Scanne l'historique complet sur push, uniquement les fichiers modifiés sur PR. |
| **SAST** | [semgrep](https://semgrep.dev) | Analyse statique de sécurité du code source. Détecte injections SQL/XSS, mauvaises pratiques crypto, patterns OWASP Top 10. Règles communautaires gratuites (`p/typescript`, `p/nodejs`, `p/owasp-top-ten`). |
| **Trivy** | [trivy](https://trivy.dev) | Scan du filesystem : vulnérabilités de dépendances, secrets résiduels, misconfigurations (Dockerfiles, fichiers de config). Sévérité HIGH et CRITICAL uniquement. |

> Les vulnérabilités détectées par OSV Scanner ou Trivy peuvent être patchées via les [overrides pnpm](https://pnpm.io/package_json#pnpmoverrides) dans `package.json` si la mise à jour directe n'est pas possible.

### `lighthouse.yml` — Performance

Tourne sur chaque push vers `main`. Lance [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) sur le frontend et le backoffice, publie les rapports (+ couverture de code backend) sur **GitHub Pages**.
