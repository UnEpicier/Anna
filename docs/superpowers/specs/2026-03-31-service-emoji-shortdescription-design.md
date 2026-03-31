# Design : Ajout des champs `emoji` et `shortDescription` aux Services

**Date :** 2026-03-31

## Contexte

Le modèle `Services` n'a plus de champ `icon` (supprimé). On ajoute deux nouveaux champs :
- `emoji` : affiché sur la landing page dans la grille "compagnons"
- `shortDescription` : description courte pour la landing page (la page `/services` garde `description`)

## Changements

### 1. Prisma (`apps/backend/prisma/schema.prisma`)

Ajout dans le modèle `Services` :
```
emoji            String
shortDescription String
```

Migration Prisma avec valeur par défaut `🐾` pour les lignes existantes (shadow default, uniquement dans la migration SQL).

### 2. Types partagés (`packages/app-types/src/service.ts`)

Ajout dans `ServiceSchema` :
```ts
emoji: z.string(),
shortDescription: z.string(),
```

Les deux champs sont obligatoires (pas de `.optional()` ni `.default()`).

### 3. Seed data (`apps/backend/prisma/data/services.ts`)

Ajout de `emoji` et `shortDescription` dans les 4 services existants (Chat, Chien, Cheval, NAC).

### 4. Backend tests (`apps/backend/src/api/services/__tests__/servicesRouter.test.ts`)

- `validateServiceStructure` : vérifier `emoji` et `shortDescription` sont des strings
- Test POST `newService` : inclure les deux nouveaux champs

### 5. Frontend landing page (`apps/frontend/app/page.tsx`)

**Refactoring :** split en server component + client component (pattern identique à `/services/page.tsx`).

- `page.tsx` devient server component : fetch `GET /services`, passe les données au client
- `content.tsx` (nouveau) : contenu actuel de `page.tsx` avec `'use client'`, reçoit `services: Service[]` en prop
- La section "Animals" remplace le tableau statique `animals` par les services filtrés (`enabled: true`), mappés ainsi :
  - `animal.emoji` ← `service.emoji`
  - `animal.name` ← `service.title`
  - `animal.description` ← `service.shortDescription`

### 6. Backoffice (`apps/backoffice/app/(app)/services/`)

**`ServiceCard.tsx`** : ajout de deux champs dans le formulaire :
- Input pour `emoji` (après le titre, avant prix/durée)
- Textarea pour `shortDescription` (après emoji, avant description)

**`content.tsx`** : dans `addService`, initialiser `emoji: ''` et `shortDescription: ''`

## Contraintes

- `emoji` et `shortDescription` obligatoires à la création (validation Zod côté backend)
- La migration utilise `🐾` comme valeur par défaut pour les lignes existantes uniquement
- Le fetch de la landing page est `no-store` (données fraîches, cohérent avec la page `/services`)
- Seuls les services `enabled: true` s'affichent sur la landing page
