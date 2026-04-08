# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [frontend@1.2.3] [backoffice@1.3.2] [backend@1.5.5] [app-types@0.5.1] - 2026-04-08

### Changed
- Renamed PopupMessage to Announcement across the entire stack (frontend, backoffice, backend, types)

### Fixed
- Auth: do not use cache to retrieve email from informations services
- Validate PUT body with Zod in announcement service and add rel to CTA anchor

## [frontend@1.2.0] [backoffice@1.3.0] [backend@1.5.0] [app-types@0.5.0] - 2026-04-08

### Added
- Announcement system: modal displayed once per session on the frontend
- Backoffice: announcement management section
- Backend: PopupMessage model, repository, service, controller and routes
- Types: PopupMessage type and UpServices health check type

## [backend@1.4.0] - 2026-03-31

### Added
- Redis cache layer for improved API performance

## [frontend@1.1.0] [backoffice@1.2.0] [backend@1.3.0] [app-types@0.3.0] - 2026-03-31

### Added
- Services: emoji and short description fields across the stack
- Frontend: dynamic services replace static animal icons on landing page
- Backoffice: emoji picker and short description input in service form

### Removed
- Services: icon field removed from Service type, schema, seed and API

## [backoffice@1.0.0] - 2026-03-30

### Added
- Complete editorial redesign of the backoffice:
  - New theme: primary color #c4956a, zero border-radius, editorial sidebar
  - All pages redesigned: dashboard, departments, social, services, schedule, informations, leave, auth, 404

## [frontend@1.0.0] - 2026-03-30

### Added
- Complete editorial dark redesign of the public website:
  - Full-screen immersive hero, editorial navbar, numbered sections
  - Dark editorial footer, contact page, error and not-found pages
  - Leave banner with infinite scroll marquee
- SEO: metadata, sitemap.xml, robots.txt, JSON-LD schema

## [backend@1.1.0] [backoffice@0.8.0] - 2026-03-27

### Added
- Leave management: multiple concurrent leaves with nightly cleanup cron
- Backoffice: full leave management UI

## [backend@1.0.0] - 2026-03-22

### Added
- OTP-based email authentication with Mailjet
- Auth middleware enforcing authentication on protected routes
- Auth router tests; CSRF, CSP (nonce-based), HSTS, path traversal protection in proxy

## [backoffice@0.7.0] - 2026-03-18

### Added
- Actions form with longitude, latitude and radius fields

## [backoffice@0.6.0] [backend@0.1.2] - 2026-03-17

### Added
- Backoffice: schedules management, toast notifications, services CRUD, departments and informations form actions

## [backoffice@0.1.0] - 2026-02-25

### Added
- Initial backoffice application scaffold

## [frontend@0.4.0] [backend@0.1.1] - 2026-02-24

### Added
- Blog pages connected to API (list and post)

## [frontend@0.1.0] [backend@0.1.0] - 2026-02-03

### Added
- Initial monorepo setup: Next.js frontend and Node.js backend
- Footer connected to API, navigation links, not found page (404)
- Contact page with MapTiler integration
- Shared types package (`@repo/app-types`) with Zod schemas
- Shared UI package (`@repo/ui`) with Tailwind configuration
