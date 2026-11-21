# Leaf & Bloom — Max Snischuk

- **Candidate** [Max Snischuk (@snischuk)](https://github.com/snischuk)
- **Teammate and interviewer** [Sofiia Dorosh (@sofiiadorosh)](https://github.com/sofiiadorosh)

## Project

Leaf & Bloom is an RS School team project for browsing houseplants and
accessories. Shoppers can search and filter the catalog, share a filtered
view, and manage a cart with quantity controls and a discount code. The
cart persists across pages and reloads.

Sofiia built the storefront, catalog, and filters and set up deployment to
GitHub Pages. I built the cart and worked on test tooling and repository
checks.

## My contributions

- Added GitHub issue and pull request templates. Configured checks for
  commit messages and branch names in Git hooks and CI.
  [Issue forms PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/7) ·
  [Pull request template PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/9) ·
  [Commitlint PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/11) ·
  [Branch name validation PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/13)
- Built the cart page, connected Add to Cart to the header badge, and
  implemented quantity controls, item removal, the order total, and the
  promo code. [Shopping cart PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/29)
- Preserved cart state across pages and reloads. Fixed stale quantities
  after browser Back and kept valid items when a saved entry could not
  be restored. [Cart restoration PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/31)
- Grouped code by feature and separated cart state from browser storage.
  [Project structure PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/33)
- Migrated unit tests from Jest to Vitest. Added Playwright scenarios
  for catalog and cart journeys in Chromium, Firefox, and WebKit.
  [Vitest PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/37) ·
  [Playwright PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/39)
- Used the Playwright suite to reproduce a lost Add to Cart click after
  searching and verified the fix with the same browser test.
  [Add to Cart fix PR](https://github.com/sofiiadorosh/leaf-n-bloom/pull/42)
- Added the About us section with both contributors, the team's workflow,
  and the project's architecture.
  [About us commit](https://github.com/sofiiadorosh/leaf-n-bloom/commit/96d34bd439cdd86e9c697e23628686ac38ba947a)

## Links

- [Live store](https://sofiiadorosh.github.io/leaf-n-bloom/)
- [Team repository](https://github.com/sofiiadorosh/leaf-n-bloom)
- [GitHub Projects board](https://github.com/users/sofiiadorosh/projects/2/views/1)
- **Interview recording (Max as candidate)** — pending recording link.
