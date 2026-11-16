# Leaf & Bloom

A small online store of houseplants: catalog with search, filters and sorting, a shopping cart with a promo code, and an "About us" start page. RS School team project.

**Deploy:** https://sofiiadorosh.github.io/leaf-n-bloom/

## Tech stack

TypeScript · Vite · Sass · Jest · ESLint · Prettier · Husky + lint-staged · GitHub Actions · GitHub Pages

## Getting started

```bash
npm ci
npm run dev
```

## Scripts

| Script                 | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the dev server                 |
| `npm run build`        | Type-check and build to `dist`       |
| `npm run preview`      | Preview the production build         |
| `npm test`             | Run unit tests (Jest)                |
| `npm run lint`         | Lint with ESLint (`lint:fix` to fix) |
| `npm run format:check` | Check formatting (`format` to fix)   |

## Git hooks

- **pre-commit** — `lint-staged` runs ESLint and Prettier on staged files.
- **pre-push** — runs `npm test`.

## Workflow

- `main` is protected: changes land only through Pull Requests with a review.
- Branch names: `feature/…`, `fix/…`, `chore/…`, `test/…`, `docs/…`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat: add cart total`.
- CI (lint, format, tests, build) runs on every PR to `main`; merging to `main` deploys to GitHub Pages.
