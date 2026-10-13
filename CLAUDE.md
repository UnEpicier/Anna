# Anna — Monorepo

Site vitrine + backoffice d'un cabinet d'ostéopathie animalière. Monorepo pnpm + Turborepo.

## Commits

- Convention Angular (`type(scope): description`), **sur une seule ligne**.
- **Pas de body**, **pas de `Co-Authored-By`**, aucune mention d'auteur ni de Claude.
- Types utilisés : `feat`, `fix`, `refactor`, `chore`, `style`, `build`, `docs`, `test`, `ci`.
- Les commits pilotent `semantic-release` par package (`feat` = minor, `fix`/`refactor`/`style`/`build` = patch). Le scope doit refléter la zone touchée (`auth`, `leave`, `frontend`, `backoffice`...).
- Ne jamais éditer à la main les `version` des `package.json` ni les `CHANGELOG.md` : ils sont générés par la CI (`chore(release): ... [skip ci]`).

## Structure

- `apps/backend` — API Express 5 + Prisma 7 (PostgreSQL) + Redis
- `apps/frontend` — site vitrine Next.js 16 (port 3000)
- `apps/backoffice` — dashboard admin Next.js 16 (port 3001)
- `packages/app-types` — types partagés (buildé en `dist`, à builder avant backend/frontend)
- `packages/utils`, `packages/ui`, `packages/typescript-config`

## Commandes

Node ≥ 24 requis (LTS active) ; la CI et l'image Docker (`node:24-alpine`, épinglée pour éviter le saut automatique du tag `lts`) tournent en Node 24. Les `@types/node` suivent cette majeure.

```bash
pnpm deps:up          # PostgreSQL + Redis (docker) pour le dev
pnpm dev              # toutes les apps (ou --filter=backend|frontend|backoffice)
pnpm lint             # biome lint (turbo)
pnpm lint:fix         # biome check --write
pnpm format
pnpm check-types
pnpm knip             # code mort (échoue en CI)
pnpm build
```

Backend (`apps/backend`) : `pnpm test` (reset + seed de la DB via `pretest`), `pnpm test:cov` (seuils 75 %), `pnpm prisma:migrate`, `pnpm prisma:generate`.
Frontend (`apps/frontend`) : `pnpm size` (size-limit, 3400 kB de JS chunks max, à lancer après `pnpm build`).

## Docker

- Image du backend : `docker build -f apps/backend/Dockerfile -t anna-api .` (contexte = racine du repo). Multi-stage : install filtré `--filter backend...`, build de `@repo/app-types`, `prisma generate`, build, puis `pnpm deploy --prod --legacy` pour un runner en `node:24-alpine`, utilisateur `node`, avec `HEALTHCHECK` sur `/health-check`.
- **Migrations automatiques** : le conteneur démarre via `apps/backend/start.sh`, qui lance `prisma migrate deploy` puis `node dist/index.js`. Un `rollout restart` applique donc les migrations en attente avant que l'API ne serve du trafic ; `migrate deploy` prend un verrou advisory PostgreSQL, plusieurs réplicas peuvent démarrer en même temps. Si une migration échoue, le conteneur sort en erreur (l'ancien pod continue de servir). `SKIP_MIGRATIONS=true` désactive l'étape.
- `prisma` est une dépendance de production du backend (nécessaire à `migrate deploy`) et son moteur (`schema-engine`) est téléchargé au build : aucun accès réseau n'est requis au démarrage. Les moteurs des autres bases (sqlite, mysql, sqlserver, cockroachdb) sont supprimés de `@prisma/client` dans l'image.
- Le seed n'est pas exécuté automatiquement (table `departments` à alimenter une fois : `pnpm prisma:seed` depuis `apps/backend` avec `DATABASE_URL` pointant sur la base cible).
- Aucun `.env` n'est copié dans l'image : la configuration est injectée à l'exécution (`env_file` + `environment` dans `docker-compose.yaml`, où `DATABASE_URL` et `REDIS_HOST` pointent sur les services `postgres` et `redis`). Variables requises par l'API : voir `envConfig.ts`.
- `docker-compose.yaml` : l'API attend que postgres et redis soient `healthy` (healthchecks dans `docker-compose.deps.yaml`). Les `container_name` sont fixes : ne pas lancer deux stacks sur la même machine.
- Le `.dockerignore` est à la racine. Si une nouvelle dépendance workspace est utilisée par le backend, ajouter son `package.json` et son dossier dans le Dockerfile.
- `next dev` et `turbo` génèrent des `AGENTS.md` / `CLAUDE.md` : ne pas les committer.

## CI (à garder au vert avant de pousser)

`lint`, `check-types`, `knip`, `test-backend` (couverture), `size-limit`, `build`, puis `release`. Workflow `security.yml` : OSV scanner sur `pnpm-lock.yaml`, gitleaks, semgrep (`p/typescript`, `p/nodejs`, `p/owasp-top-ten`), Trivy (HIGH/CRITICAL, `ignore-unfixed`), `npm audit signatures` (signatures et provenance des paquets installés) et Socket (`socket ci`, nécessite le secret `SOCKET_SECURITY_API_KEY`, ignoré s'il est absent).

## Style de code

- Biome uniquement (pas d'ESLint/Prettier) : **tabulations** (largeur 4), 80 colonnes, **simple quotes** (JS et JSX), `;` toujours, trailing commas `es5`, parenthèses toujours autour des paramètres de flèche.
- TypeScript strict. Alias `@/*` → `src/*` dans le backend.
- Pas de `console.log` de debug laissé dans le code ; `console.info` / `console.error` pour les logs légitimes du backend.
- Les packages internes sont importés via `@repo/*`.

## Backend

- Découpage par feature dans `src/api/<feature>/` : `Router` → `Controller` → `Service` → `Repository`, tests dans `__tests__/` (`<feature>Service.test.ts`, `<feature>Router.test.ts`).
- Fichiers en camelCase (`leaveService.ts`) ; classes `XxxService`, `XxxRepository`, `XxxController`, avec une instance exportée (`export const leaveService = new LeaveService()`).
- Le service reçoit son repository par injection dans le constructeur (défaut : nouvelle instance) pour pouvoir le mocker.
- Méthodes de repository suffixées `Async` (`findAllAsync`, `createAsync`...).
- Les services ne lèvent pas : ils retournent toujours une `ServiceResponse.success/failure(message, responseObject, statusCode)`, avec `try/catch`, `console.error` et un message générique en 500. Les controllers se contentent de `res.status(serviceResponse.statusCode).send(serviceResponse)`.
- Erreur Prisma `P2025` (introuvable) → 404 ; `NO_CONTENT` pour « rien trouvé » sur les lectures publiques.
- Routes d'écriture et d'admin protégées par le middleware `requireAuth` (cookie `token`, JWT httpOnly, `sameSite: strict`, `secure` en production). Les GET publics du frontend n'en ont pas.
- Redis sert de cache : clé = nom de la ressource (`leaves`, `frontendLeave`...), **invalider (`del`) toutes les clés concernées à chaque create/update/delete**.
- Auth par code temporaire envoyé par mail (Mailjet) : clés Redis `authCode:`, `authEmail:`, `sessionClient:`, `authResendCooldown:`, TTL 10 min, cooldown de renvoi 60 s. L'email est comparé en `trim().toLowerCase()` et c'est l'email canonique (celui du service `informations`) qui est utilisé ensuite.
- Variables d'environnement : toute nouvelle variable doit être ajoutée au schéma zod de `src/commons/utils/envConfig.ts` **et** à `apps/backend/.env.example` **et** aux `env:` des jobs CI concernés. Ne jamais lire `process.env` ailleurs. `JWT_SECRET` ≥ 32 caractères.
- Le client Prisma est généré dans `src/generated/prisma-client` (non versionné) : `pnpm prisma:generate` après un changement de `schema.prisma`. Tout changement de schéma passe par une migration (`pnpm prisma:migrate`) et met à jour `prisma/seed.ts` / `prisma/data/*` si besoin.
- Les tâches planifiées (`node-cron`) se déclarent dans `src/index.ts`.
- Les tests utilisent Vitest (globals), mockent le repository (`vi.mock`) et `@/libs/redis`, et suivent le schéma `// Arrange` / `// Act` / `// Assert`. `restoreMocks` est activé.

## Frontend et backoffice

- Next.js App Router + React 19 + Tailwind CSS 4. Composants UI partagés dans `packages/ui` ; composants propres à l'app dans `ui/`, composants spécifiques à une page dans `app/<route>/components/`.
- Pattern par page : `page.tsx` (server, fetch + metadata) et `content.tsx` (rendu/client).
- Les appels à l'API se font côté serveur avec `fetch(`${process.env.API_URL}/...`)` et un `ResponseObject<T>` de `@repo/app-types` ; toujours vérifier `ok` et `success` avant d'utiliser `responseObject`.
- Textes visibles en français.
- Frontend : CSP définie dans `next.config.ts` ; toute nouvelle origine externe (images, fonts, API) doit y être ajoutée. Backoffice : CSP avec nonce dans `proxy.ts`, qui redirige vers `/auth/login` sans cookie `token`.
- Les cartes utilisent MapTiler / deck.gl (`NEXT_PUBLIC_MAPTILER_API_KEY`).
- `knip` : tout export, fichier ou dépendance inutilisé fait échouer la CI ; n'ajouter une exception à `knip.config.ts` que justifiée par un commentaire.

## Sécurité

- Ne jamais committer de `.env` ni de secret (gitleaks tourne en CI). Mettre à jour les `.env.example` à la place.
- Les overrides de sécurité de `pnpm.overrides` (racine) servent à corriger des CVE transitives : ne pas les retirer sans relancer `osv-scanner`. Une CVE sans correctif upstream s'ignore dans `osv-scanner.toml` avec raison et date d'expiration.
- `pnpm-workspace.yaml` impose `minimumReleaseAge: 10080` (7 jours) et `blockExoticSubdeps` : une version publiée depuis moins de 7 jours ne s'installe pas, il faut viser la dernière version plus ancienne. `trustPolicy: no-downgrade` est volontairement désactivé (rejette des versions legacy légitimes).
- `prisma`, `@prisma/client` et `@prisma/adapter-pg` sont épinglés en exact (7.9.1) : `prisma@7.10.0` a été publié sans provenance/trusted publisher alors que les versions précédentes en avaient. À ne remonter qu'une fois la provenance rétablie.
- Les actions GitHub des workflows sont épinglées par SHA de commit (avec le tag en commentaire) : garder ce format pour toute nouvelle action (règle semgrep `github-actions-mutable-action-tag`).
- Le `turbo` CLI génère un `AGENTS.md` quand il détecte un agent : ne pas le committer.
