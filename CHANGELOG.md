# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [frontend@1.0.0] - 2026-03-30

### Added
- Complete editorial dark redesign of the public website:
  - Full-screen immersive hero with motion animations
  - Editorial asymmetric navbar with scroll behavior and responsive menu
  - Numbered editorial benefits section
  - Animals section with dark grid layout
  - Asymmetric about section
  - Services page redesign with numbered editorial list
  - Session type page with scroll-driven timeline
  - Dark editorial footer with error and not-found pages
  - Dark editorial contact page with form and embedded map
- Leave banner with seamless infinite scroll marquee
- SEO: metadata, sitemap.xml, robots.txt, dynamic JSON-LD schema
- Two-finger gesture required to scroll maps on mobile

### Changed
- Primary color and square button style unified across all pages
- Static animal icons replaced with dynamic services from API

## [backend@1.1.0] [backoffice@0.8.0] - 2026-03-27

### Added
- Leave management: multiple leaves support with nightly cleanup cron
- Backoffice: full leave management UI

## [backend@1.0.0] - 2026-03-22

### Added
- OTP-based email authentication with Mailjet
- Auth middleware enforcing authentication on protected routes
- Auth router tests with Mailjet mock to capture OTP tokens
- Backoffice: CSRF Origin validation, nonce-based CSP, HSTS, path traversal protection

### Fixed
- Auth: SameSite=Strict cookie configuration and logout error handling
- Backoffice: security headers, auth cookie forwarding, MapTiler key moved server-side

## [backoffice@0.7.0] - 2026-03-18

### Added
- Actions form with longitude, latitude and radius fields

## [backoffice@0.6.0] [backend@0.1.2] - 2026-03-17

### Added
- Backoffice: full schedules management, toast notifications, services CRUD
- Backoffice: departments and informations form actions
- Backend: initial test suite

## [backoffice@0.1.0] - 2026-02-25

### Added
- Initial backoffice application scaffold

## [frontend@0.4.0] [backend@0.1.1] - 2026-02-24

### Added
- Blog pages connected to API (list and post)

## [frontend@0.1.0] [backend@0.1.0] - 2026-02-03

### Added
- Initial monorepo setup: Next.js frontend and Node.js backend
- Footer connected to API, navigation links, not found page
- Contact page with MapTiler integration
- Shared types and UI packages
