# Leaf & Bloom

An online houseplant store built as an RS School team project. Find a plant
for any corner, filter the catalog by light or pet safety, and check out with
a cart that remembers your picks.

**Live demo:** https://sofiiadorosh.github.io/leaf-n-bloom/

## Features

- **Home page** with categories, a featured plant, best sellers and a section
  about the project and the team
- **Catalog search** by plant name
- **Filters** by plant type, light needs, pet safety and price range
- **Sorting** by price
- **Shareable catalog links**: search, filters and sort order are saved in the
  URL, so the same view can be reopened or sent to someone
- **Cart** with quantity changes and product removal, saved across pages and
  reloads
- **Promo codes**: `SALE10` takes 10% off the order total
- **Mobile menu** with a slide-in panel, focus trap and cart item count
- **Keyboard support** for the menu, sort dropdown and filters

## Tech stack

TypeScript · Vite · SCSS · Vitest · Playwright · ESLint · Prettier ·
Husky + lint-staged · Commitlint · validate-branch-name · GitHub Actions ·
GitHub Pages

## Getting started

You need Node.js 24 (the version used in CI) and npm.

```bash
git clone https://github.com/sofiiadorosh/leaf-n-bloom.git
cd leaf-n-bloom
npm ci
npm run dev
```

Vite prints the local URL. The site is served under `/leaf-n-bloom/`.

## Scripts

| Script                 | Description                                 |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start the dev server                        |
| `npm run build`        | Type-check and build to `dist`              |
| `npm run preview`      | Preview the production build                |
| `npm test`             | Run unit tests with Vitest                  |
| `npm run test:watch`   | Rerun affected unit tests as files change   |
| `npm run test:e2e`     | Run browser tests with Playwright           |
| `npm run lint`         | Lint with ESLint (`npm run lint:fix` fixes) |
| `npm run format:check` | Check formatting (`npm run format` fixes)   |

## Testing

### Unit tests

Vitest runs the tests in `tests/unit/`. They cover the catalog logic
(filtering, sorting, URL parameters, category summaries), cart calculations
and promo codes, cart storage and recovery, and price formatting.

```bash
npm test
```

### Browser tests

Playwright runs the tests in `tests/e2e/` in Chromium, Firefox and WebKit. It
starts its own Vite server, so you don't need to run `npm run dev` first. The
scenarios cover shopper journeys: browsing a category, reopening a shared
catalog link, clearing the search, adding products, changing quantities,
applying a promo code, emptying the cart and using the mobile menu.

Install the browsers once, then run the tests:

```bash
npx playwright install chromium firefox webkit
```

```bash
npm run test:e2e
```

To run one browser, pass `--project`:

```bash
npm run test:e2e -- --project=webkit
```

When a scenario fails, the terminal shows the expected and actual results,
and Playwright saves a trace in `test-results/`.

## Project structure

```text
├── index.html, shop.html,      # One HTML file per page
│   cart.html, 404.html
├── public/
│   ├── icons/sprite.svg        # SVG sprite used through <svg><use>
│   └── images/                 # Product and page images
├── src/
│   ├── constants/              # Product data, categories, filters, breakpoints
│   ├── core/                   # Logic without DOM access
│   │   ├── cart/               # Cart totals, promo codes, storage, store
│   │   ├── catalog/            # Filtering, sorting, URL parameters
│   │   └── types.ts            # Shared types
│   ├── ui/                     # Rendering and DOM events
│   │   ├── cart/               # Cart page, cart badge, add-to-cart
│   │   ├── catalog/            # Catalog, filters, dropdown, home sections
│   │   └── shared/             # Header menu, footer, helpers
│   ├── pages/                  # Entry script for each HTML page
│   └── styles/                 # SCSS: abstracts, base, components, layout
└── tests/
    ├── unit/                   # Vitest
    └── e2e/                    # Playwright
```

## Architecture

- **Multi-page app.** Home, Shop and Cart are separate HTML pages. Search
  engines and visitors see titles, headings and links before JavaScript runs.
  Each page loads one entry script from `src/pages/`.
- **Core and UI are separate.** `src/core/` holds the logic and never touches
  the DOM, so it can be tested with Vitest alone. `src/ui/` renders elements
  and handles events.
- **Catalog.** Product cards render from one product list in
  `src/constants/catalog/products.ts`. Search, filters and sort order are
  stored in the URL query string.
- **Cart.** The cart stores product IDs and quantities in `localStorage` and
  reads prices from the catalog, so a stored cart can't change a price. Totals
  are calculated in cents to avoid rounding errors.
- **Styles.** SCSS with BEM class names, shared variables and mixins in
  `src/styles/abstracts/`, and mobile-first breakpoints at 768px and 1200px.

## Workflow

1. Create a GitHub issue from a template, with acceptance criteria, and track
   it on the project board.
2. Create a branch from the latest `main`. Branch names must match
   `<type>/<short-description>`, for example `feat/mobile-menu`. Allowed
   types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`.
3. Make focused commits that follow
   [Conventional Commits](https://www.conventionalcommits.org/), for example
   `feat: add mobile navigation menu`.
4. Open a pull request with the template, link the issue and describe how to
   test the change.
5. A teammate reviews the pull request while CI runs.
6. After review and passing checks, merge into `main`. The `main` branch is
   protected and accepts changes only through pull requests.
7. Merging into `main` deploys the site to GitHub Pages.

### Git hooks

- **commit-msg**: Commitlint checks the commit message.
- **pre-commit**: lint-staged runs ESLint and Prettier on staged files.
- **pre-push**: validate-branch-name checks the branch name, then `npm test`
  runs.

### CI

- **CI** runs on every pull request to `main`: commit message check, branch
  name check, lint, format check, unit tests and build.
- **Deploy** runs on every push to `main`: unit tests, build and deploy to
  GitHub Pages.

## Team

| Member                                                           | Area                                                             |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Sofiia Dorosh ([@sofiiadorosh](https://github.com/sofiiadorosh)) | Catalog, search, filters, home page, shared layout, CI/CD        |
| Max Snischuk ([@snischuk](https://github.com/snischuk))          | Cart, promo codes, cart storage, unit and browser tests, tooling |
