# Leaf & Bloom

A small online store of houseplants: catalog with search, filters and sorting, a shopping cart with a promo code, and an "About us" start page. RS School team project.

**Deploy:** https://sofiiadorosh.github.io/leaf-n-bloom/

## Tech stack

TypeScript · Vite · Sass · Vitest · Playwright · ESLint · Prettier · Husky + lint-staged · GitHub Actions · GitHub Pages

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
| `npm test`             | Run unit tests with Vitest           |
| `npm run test:watch`   | Rerun affected tests as files change |
| `npm run test:e2e`     | Run browser tests with Playwright    |
| `npm run lint`         | Lint with ESLint (`lint:fix` to fix) |
| `npm run format:check` | Check formatting (`format` to fix)   |

### Browser tests

Vitest runs the tests in `tests/unit/`. Playwright runs the tests in
`tests/e2e/` and starts its own Vite server. Install the three browsers, then run:

```bash
npx playwright install chromium firefox webkit
npm run test:e2e
```

To run one browser, pass `--project`, for example
`npm run test:e2e -- --project=webkit`.

Five scenarios pass in each browser. The other two reproduce the same bugs
in Chromium, Firefox, and WebKit:

- One click on Reset clears the search input, but the results and URL stay filtered.
- The first click on Add to Cart after typing in Search does not add the product.

The terminal output shows the expected and actual results. Playwright saves
a trace for each failed scenario in `test-results/`.

## Git hooks

- **pre-commit** — `lint-staged` runs ESLint and Prettier on staged files.
- **pre-push** — runs `npm test`.

## Workflow

- `main` is protected: changes land only through Pull Requests with a review.
- Branch names: `feature/…`, `fix/…`, `chore/…`, `test/…`, `docs/…`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat: add cart total`.
- CI (lint, format, tests, build) runs on every PR to `main`; merging to `main` deploys to GitHub Pages.
