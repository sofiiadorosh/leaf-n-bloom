# Leaf & Bloom — Max Snischuk

## Team

- Max Snischuk ([@snischuk](https://github.com/snischuk))
- Partner and interviewer — Sofiia Dorosh ([@sofiiadorosh](https://github.com/sofiiadorosh))

## About the app

Leaf & Bloom is an online houseplant store built as an RS School team
project. Shoppers can search by plant name, filter by plant type, light
needs, pet safety, and price, sort by price, and share their catalog view
through the URL. Product details include a photo gallery, a care guide,
and size options. The cart keeps selected sizes, extra care, and quantities
across pages and reloads. The `SALE10` promo code applies a 10% discount.

Sofiia built the storefront, catalog, and product details and set up
deployment to GitHub Pages. I built the initial cart, added browser tests,
and set up repository checks.

## My tasks

- Built the cart page with quantity controls, item removal, order totals,
  and promo code support. Connected Add to Cart to the header item count.
  [Shopping cart PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/29)
- Fixed stale cart quantities when shoppers returned to a page using the
  browser's Back button. Updated cart restoration to keep valid entries
  even when another saved entry could not be restored.
  [Cart restoration PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/31)
- Grouped code by feature and separated cart state from browser storage.
  [Project structure PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/33)
- Migrated unit tests from Jest to Vitest. Added Playwright scenarios
  for catalog and cart journeys in Chromium, Firefox, and WebKit.
  [Vitest PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/37) ·
  [Playwright PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/39)
- Reproduced a bug where the first Add to Cart click after a search had no
  effect. Fixed it and kept the Playwright scenario as a regression test.
  [Add to Cart fix PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/42)
- Added the original About section with both contributors, the team's workflow,
  and the project's architecture.
  [About us commit](https://github.com/sofiiadorosh/leaf-n-bloom/commit/96d34bd439cdd86e9c697e23628686ac38ba947a)
- Added GitHub issue forms and a pull request template. Configured
  Git hooks and CI to check commit messages and branch names.
  [Issue forms PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/7) ·
  [Pull request template PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/9) ·
  [Commitlint PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/11) ·
  [Branch name validation PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/13)

## Links

- [Deploy](https://sofiiadorosh.github.io/leaf-n-bloom/)
- [Repository](https://github.com/sofiiadorosh/leaf-n-bloom)
- [Task board](https://github.com/users/sofiiadorosh/projects/2/views/1)
- [My interview as a candidate](https://youtu.be/UJvY4fLDjgU)
