import { expect, test } from '@playwright/test';

test('a shopper compares product ratings on Shop and in product details', async ({
  page,
}) => {
  await page.goto('shop.html');

  const card = (name: string) =>
    page.getByRole('article').filter({
      has: page.getByRole('heading', { name, exact: true }),
    });

  await expect(
    card('Monstera Deliciosa').getByRole('img', { name: 'Rated 4.9 out of 5' }),
  ).toContainText('4.9');
  await expect(
    card('Fiddle Leaf Fig').getByRole('img', { name: 'Rated 4.5 out of 5' }),
  ).toContainText('4.5');

  await page
    .getByRole('button', { name: 'Fiddle Leaf Fig', exact: true })
    .click();
  await expect(
    page
      .getByRole('dialog', { name: 'Fiddle Leaf Fig' })
      .getByRole('img', { name: 'Rated 4.5 out of 5' }),
  ).toContainText('4.5');
});
