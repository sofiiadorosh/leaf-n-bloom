import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test('a shopper opens the mobile menu and goes to Shop', async ({ page }) => {
  await page.goto('./');

  const menuButton = page.getByRole('button', { name: 'Open menu' });
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  const shopLink = navigation.getByRole('link', { name: 'Shop' });

  await expect(shopLink).toBeHidden();

  await menuButton.click();

  await expect(
    page.getByRole('button', { name: 'Close menu' }),
  ).toHaveAttribute('aria-expanded', 'true');
  await expect(shopLink).toBeVisible();

  await shopLink.click();

  await expect(page).toHaveURL(/shop\.html$/);
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Shop' }),
  ).toBeHidden();
});

test('a shopper closes the mobile menu with Escape and keeps focus on the menu button', async ({
  page,
}) => {
  await page.goto('./');

  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.keyboard.press('Escape');

  const menuButton = page.getByRole('button', { name: 'Open menu' });
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expect(menuButton).toBeFocused();
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Shop' }),
  ).toBeHidden();
});
