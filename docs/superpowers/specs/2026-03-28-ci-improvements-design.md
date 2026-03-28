---
title: CI Improvements — Sécurité & Qualité
date: 2026-03-28
status: approved
---

# CI Improvements — Sécurité & Qualité

## Contexte

Le repo dispose déjà d'une CI (`ci.yml`) couvrant lint, typecheck, tests backend avec coverage, et build. Un workflow `lighthouse.yml` génère des rapports de performance sur GitHub Pages.

L'objectif est d'ajouter une couche de sécurité et de qualité de code sans dépendre d'outils payants.

**Contraintes :**
- Repo privé GitHub
- 100 % open-source et gratuit
- Les findings bloquent les PRs
- Les scans tournent sur PR/push ET en planifié (hebdomadaire)

---

## Structure cible

| Fichier | Rôle |
|---|---|
| `.github/workflows/ci.yml` | Lint, typecheck, tests, coverage threshold, knip, size-limit, build |
| `.github/workflows/security.yml` | OSV-Scanner, gitleaks, semgrep, trivy |
| `.github/workflows/lighthouse.yml` | Rapports Lighthouse (inchangé) |

---

## security.yml — Jobs de sécurité

Déclencheurs : `push` sur `main`, `pull_request` vers `main`, et cron `0 8 * * 1` (lundi 08h UTC).

### osv-scan
- **Outil :** `google/osv-scanner-action@v2`
- **Rôle :** Scanne `pnpm-lock.yaml` contre la base OSV (agrège GitHub Advisory DB, NVD, OSV.dev — plus large que `pnpm audit` seul).
- **Seuil :** Bloque sur toute vulnérabilité HIGH ou CRITICAL.
- **Pourquoi OSV plutôt que pnpm audit :** OSV agrège plusieurs bases de données dont celle utilisée par npm audit, offrant une meilleure couverture.

### secrets (gitleaks)
- **Outil :** `gitleaks/gitleaks-action@v2`
- **Rôle :** Détecte les secrets hardcodés (clés API, tokens JWT, mots de passe) dans le code et l'historique git.
- **Comportement :** Scanne l'historique complet sur push, uniquement les fichiers modifiés sur PR.
- **Seuil :** Bloque si au moins un secret est détecté.

### sast (semgrep)
- **Outil :** `semgrep/semgrep-action@v1`
- **Rôle :** Analyse statique de sécurité (SAST) — détecte injections, XSS, mauvaises pratiques crypto, OWASP Top 10.
- **Rulesets :** `p/typescript`, `p/nodejs`, `p/owasp-top-ten` (règles communautaires, aucun token requis).
- **Seuil :** Bloque sur tout finding de sévérité ERROR.

### trivy
- **Outil :** `aquasecurity/trivy-action@master`
- **Rôle :** Scan filesystem — vulnérabilités de dépendances, secrets résiduels, misconfigurations (fichiers de config, Dockerfiles, permissions).
- **Sévérité ciblée :** HIGH et CRITICAL uniquement pour éviter le bruit des findings LOW/MEDIUM.
- **Seuil :** Bloque si au moins un finding HIGH/CRITICAL.

---

## ci.yml — Ajouts qualité

### coverage threshold
- **Outil :** Configuration `coverage.thresholds` dans `vite.config.mts`
- **Rôle :** Fait échouer le job de tests si la couverture de code passe sous le seuil défini.
- **Seuil initial :** 80 % (lines, functions, branches, statements) — à ajuster selon la couverture actuelle.

### knip
- **Outil :** `knip` (via `pnpm dlx knip`)
- **Rôle :** Détecte les exports, fichiers, et dépendances non utilisés dans le monorepo.
- **Seuil :** Bloque si des unused exports ou dépendances sont trouvés.

### size-limit
- **Outil :** `size-limit` avec `@size-limit/preset-next`
- **Rôle :** Surveille la taille du bundle Next.js frontend à chaque PR. Empêche les régressions de taille involontaires.
- **Configuration :** Fichier `.size-limit.json` à la racine du frontend avec les seuils initiaux mesurés lors de la mise en place.
- **Seuil :** Bloque si le bundle dépasse le seuil configuré.

---

## README

Ajouter une section `## CI / Intégration Continue` dans le `README.md` racine documentant :
- Vue d'ensemble des deux workflows
- Description de chaque job avec son rôle
- Badges de statut des workflows

---

## Ordre d'implémentation

1. `security.yml` (osv-scan → gitleaks → semgrep → trivy)
2. Coverage threshold dans `vite.config.mts`
3. Knip dans `ci.yml`
4. size-limit : config frontend + job CI
5. Section CI dans `README.md`
