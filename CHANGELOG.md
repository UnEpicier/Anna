# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [backend@1.0.0] - 2026-03-22

### Added
- OTP-based email authentication with Mailjet
- Auth middleware enforcing authentication on protected routes
- Auth router tests with Mailjet mock to capture OTP tokens
- Backoffice: CSRF Origin validation on mutating API proxy requests
- Backoffice: nonce-based Content-Security-Policy via proxy
- Backoffice: HSTS header with 1-year max-age and includeSubDomains
- Backoffice: proxy path segment validation to prevent path traversal

### Fixed
- Auth: SameSite=Strict cookie configuration and logout error handling
- Auth: matching options for clearCookie in production
- Backoffice: security headers, auth cookie forwarding, parallel fetches
- Backoffice: MapTiler key moved server-side; social URLs validated
- Backend: security vulnerabilities in initial implementation

## [backoffice@0.7.0] - 2026-03-18

### Added
- Actions form with longitude, latitude and radius fields

## [backoffice@0.6.0] [backend@0.1.2] - 2026-03-17

### Added
- Backoffice: full schedules management
- Backoffice: toast notifications
- Backoffice: update and create services
- Backoffice: departments and informations form actions
- Backend: initial test suite

## [backoffice@0.1.0] - 2026-02-25

### Added
- Initial backoffice application scaffold

## [frontend@0.4.0] [backend@0.1.1] - 2026-02-24

### Added
- Blog pages connected to API (list and post)

### Fixed
- Backend: permissive type assertions

## [frontend@0.1.0] [backend@0.1.0] - 2026-02-03

### Added
- Initial monorepo setup: Next.js frontend and Node.js backend
- Footer connected to API with navigation links
- Not found page (404)
- Contact page with MapTiler integration
- Shared types package (`@repo/app-types`) with Zod schemas
- Shared UI package (`@repo/ui`) with Tailwind configuration
