# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [backoffice@1.0.0] - 2026-03-30

### Added
- Complete editorial redesign of the backoffice:
  - New theme: primary color #c4956a, zero border-radius, editorial sidebar
  - Dashboard: colored stat cards and quick links
  - Departments, social, services, schedule, informations, leave pages redesigned
  - Auth pages: clean bordered layout replacing Card component
  - 404 page: editorial style

### Changed
- All backoffice pages migrated to the new editorial design system
- Services page: square card style, icon picker removed

## [frontend@1.0.0] - 2026-03-30

### Added
- Complete editorial dark redesign of the public website
- Leave banner with infinite scroll marquee
- SEO: metadata, sitemap.xml, robots.txt, dynamic JSON-LD schema

## [backend@1.1.0] [backoffice@0.8.0] - 2026-03-27

### Added
- Leave management: multiple leaves support with nightly cleanup cron
- Backoffice: full leave management UI

## [backend@1.0.0] - 2026-03-22

### Added
- OTP-based email authentication with Mailjet
- Auth middleware enforcing authentication on protected routes
- Auth router tests; CSRF, CSP, HSTS, path traversal protection

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
- Footer, navigation, not found page, contact page with MapTiler
- Shared types and UI packages
