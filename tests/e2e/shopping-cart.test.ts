import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const productName = 'Monstera Deliciosa';

const addMonsteraButton = (page: Page) =>
  page
    .getByRole('article')
    .filter({
      has: page.getByRole('heading', { name: productName, exact: true }),
    })
    .getByRole('button', { name: /^(Add to Cart|Added)/i });

const cartLink = (page: Page) => page.getByRole('link', { name: /^Cart,/ });

const quantityControl = (page: Page, size = '6 inch') =>
  page.getByRole('group', { name: `Quantity of ${productName}, ${size}` });

test.beforeEach(async ({ page }) => {
  await page.goto('shop.html');
});

test('a shopper browses a category, adds a plant twice, and applies a promo code', async ({
  page,
}) => {
  await page
    .getByRole('group', { name: 'Plant Type' })
    .getByText('Indoor Plants', { exact: true })
    .click();
  await expect(page).toHaveURL(/\?category=indoor$/);

  const addButton = addMonsteraButton(page);
  await addButton.click();
  await addButton.click();
  await expect(page.locator('.cart__badge')).toHaveText('2');

  await cartLink(page).click();

  const entries = page.locator('#cart-items').getByRole('listitem');
  await expect(entries).toHaveCount(1);
  await expect(
    entries.first().getByRole('heading', { name: productName }),
  ).toBeVisible();
  await expect(
    quantityControl(page).getByText('2', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('#cart-total')).toHaveText('$59.98');
  await expect(page.locator('.cart__badge')).toHaveText('2');

  await page.getByRole('textbox', { name: 'Promo code' }).fill('SALE10');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(
    page.getByText('10% discount applied.', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('#cart-discount')).toHaveText('−$6.00');
  await expect(page.locator('#cart-total')).toHaveText('$53.98');
});

test('a shopper reloads the cart and returns to Shop without losing quantity changes', async ({
  page,
}) => {
  await addMonsteraButton(page).click();
  await expect(page.locator('.cart__badge')).toHaveText('1');
  await cartLink(page).click();

  const quantity = quantityControl(page);
  await quantity
    .getByRole('button', {
      name: `Increase quantity of ${productName}, 6 inch`,
    })
    .click();
  await expect(quantity.getByText('2', { exact: true })).toBeVisible();

  await page.reload();
  await expect(quantity.getByText('2', { exact: true })).toBeVisible();
  await expect(page.locator('#cart-total')).toHaveText('$59.98');

  await page.goBack();
  await expect(page).toHaveURL(/\/shop\.html$/);
  await expect(page.locator('.cart__badge')).toHaveText('2');

  await addMonsteraButton(page).click();
  await expect(page.locator('.cart__badge')).toHaveText('3');
  await cartLink(page).click();
  await expect(quantity.getByText('3', { exact: true })).toBeVisible();
  await expect(page.locator('#cart-total')).toHaveText('$89.97');
});

test('a shopper removes the last product and returns to the catalog from the empty cart', async ({
  page,
}) => {
  await addMonsteraButton(page).click();
  await cartLink(page).click();
  await expect(page.locator('#cart-total')).toHaveText('$29.99');

  await page
    .getByRole('button', { name: `Remove ${productName}, 6 inch` })
    .click();

  await expect(
    page.getByText('Your cart is empty.', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('#cart-items').getByRole('listitem')).toHaveCount(
    0,
  );
  await expect(page.locator('#cart-total')).toHaveText('$0.00');
  await expect(page.locator('.cart__badge')).toBeHidden();

  await page.getByRole('link', { name: 'Explore Plants', exact: true }).click();
  await expect(page).toHaveURL(/\/shop\.html$/);
  await expect(addMonsteraButton(page)).toBeVisible();
  await expect(page.locator('.cart__badge')).toBeHidden();
});

test('a shopper corrects an invalid promo code and receives the discount', async ({
  page,
}) => {
  await addMonsteraButton(page).click();
  await cartLink(page).click();
  await expect(page.locator('#cart-total')).toHaveText('$29.99');

  const promoCode = page.getByRole('textbox', { name: 'Promo code' });
  const apply = page.getByRole('button', { name: 'Apply', exact: true });
  await promoCode.fill('INVALID');
  await apply.click();
  await expect(
    page.getByText('This promo code is not valid.', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('#cart-total')).toHaveText('$29.99');

  await promoCode.fill('SALE10');
  await apply.click();

  await expect(
    page.getByText('10% discount applied.', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('#cart-discount')).toHaveText('−$3.00');
  await expect(page.locator('#cart-total')).toHaveText('$26.99');
});

test('a shopper adds a plant directly from search results', async ({
  page,
}) => {
  const badge = page.locator('.cart__badge');
  const search = page.getByRole('searchbox', { name: 'Search', exact: true });

  await expect(badge).toBeHidden();
  await test.step('Find Monstera by typing in Search', async () => {
    await search.fill('Monstera');
    await expect(page.locator('.catalog__item')).toHaveCount(1);
    await expect(search).toBeFocused();
  });

  await test.step('Click Add to Cart once and check the badge', async () => {
    await addMonsteraButton(page).click();
    await expect(badge).toHaveText('1');
  });

  await cartLink(page).click();
  await expect(page.getByRole('heading', { name: productName })).toBeVisible();
});

test('a shopper adds two sizes of one plant and sees each size in the cart', async ({
  page,
}) => {
  await addMonsteraButton(page).click();
  await expect(page.locator('.cart__badge')).toHaveText('1');

  await page.getByRole('button', { name: productName, exact: true }).click();
  const drawer = page.getByRole('dialog', { name: productName });
  await drawer.getByText('8 inch', { exact: true }).click();
  await drawer.getByRole('button', { name: 'Increase quantity' }).click();
  await drawer.getByRole('button', { name: 'Add to Cart' }).click();
  await expect(drawer).toBeHidden();
  await expect(page.locator('.cart__badge')).toHaveText('3');

  await cartLink(page).click();

  const entries = page.locator('#cart-items').getByRole('listitem');
  await expect(entries).toHaveCount(2);
  await expect(entries.nth(0)).toContainText('6 inch');
  await expect(entries.nth(0)).toContainText('$29.99 each');
  await expect(entries.nth(1)).toContainText('8 inch');
  await expect(entries.nth(1)).toContainText('$44.99 each');
  await expect(
    quantityControl(page, '8 inch').getByText('2', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('#cart-subtotal')).toHaveText('$119.97');

  await page
    .getByRole('button', { name: `Remove ${productName}, 6 inch` })
    .click();
  await expect(entries).toHaveCount(1);
  await expect(page.locator('#cart-total')).toHaveText('$89.98');
  await expect(page.locator('.cart__badge')).toHaveText('2');
});
