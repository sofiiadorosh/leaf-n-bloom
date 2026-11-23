import { expect, test } from '@playwright/test';

const productName = 'Monstera Deliciosa';

test('a shopper opens product details from Shop, picks a size and adds the plant to the cart', async ({
  page,
}) => {
  await page.goto('shop.html');

  const openButton = page.getByRole('button', {
    name: productName,
    exact: true,
  });
  await openButton.click();

  const drawer = page.getByRole('dialog', { name: productName });
  await expect(drawer).toBeVisible();
  const price = drawer.locator('.product-drawer__price');
  await expect(price).toHaveText('$29.99');

  await drawer.getByRole('button', { name: 'Show photo 2 of 4' }).click();
  await expect(
    drawer.getByRole('button', { name: 'Show photo 2 of 4' }),
  ).toHaveAttribute('aria-current', 'true');

  await drawer.getByRole('tab', { name: 'Care Guide' }).click();
  await expect(drawer.getByRole('tabpanel')).toContainText('Every 1–2 weeks');

  await drawer.getByText('8 inch', { exact: true }).click();
  await expect(price).toHaveText('$44.99');
  await expect(drawer.getByRole('tabpanel')).toContainText('8 inch');

  await drawer.getByRole('button', { name: 'Increase quantity' }).click();
  await drawer.getByRole('button', { name: 'Add to Cart' }).click();

  await expect(drawer).toBeHidden();
  await expect(page.locator('.cart__badge')).toHaveText('2');
  await expect(openButton).toBeFocused();
});

test('a shopper closes product details with Escape without adding anything', async ({
  page,
}) => {
  await page.goto('./');

  const openButton = page
    .locator('.best-sellers__list')
    .getByRole('button')
    .first();
  const name = await openButton.textContent();
  await openButton.click();

  const drawer = page.getByRole('dialog', { name: name ?? '' });
  await expect(drawer).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(drawer).toBeHidden();
  await expect(openButton).toBeFocused();
  await expect(page.locator('.cart__badge')).toBeHidden();
});
