import { expect, test } from '@playwright/test';

test('a shopper opens a saved catalog link and sees the same category and order', async ({
  context,
  page,
}) => {
  await page.goto('shop.html');

  const category = page.getByRole('group', { name: 'Plant Type' });
  const sortButton = page.getByRole('button', { name: /Sort by/ });
  const products = page.locator('.catalog').getByRole('heading', { level: 3 });

  await category.getByText('Succulents', { exact: true }).click();
  await sortButton.click();
  await page.getByRole('option', { name: 'Price: Low to High' }).click();

  const sortedSucculents = ['Haworthia Zebra', 'Echeveria', 'Aloe Vera'];
  await expect(products).toHaveText(sortedSucculents);
  await expect(page).toHaveURL(/category=succulents.*sort=price-asc/);
  const savedCatalogUrl = page.url();

  const reopenedCatalog = await context.newPage();
  await reopenedCatalog.goto(savedCatalogUrl);

  await expect(
    reopenedCatalog.getByRole('radio', { name: 'Succulents' }),
  ).toBeChecked();
  await expect(
    reopenedCatalog.getByRole('button', { name: /Sort by/ }),
  ).toContainText('Price: Low to High');
  const reopenedProducts = reopenedCatalog
    .locator('.catalog')
    .getByRole('heading', { level: 3 });
  await expect(reopenedProducts).toHaveText(sortedSucculents);
});

test('a shopper clears the search and returns to the full catalog', async ({
  page,
}) => {
  await page.goto('shop.html');

  const search = page.getByRole('searchbox', { name: 'Search', exact: true });
  const products = page.locator('.catalog__item');

  await expect(page.locator('.shop__count')).toHaveText(/^\d+ products$/);
  const unfilteredProductCount = await products.count();

  await test.step('Find Monstera', async () => {
    await search.fill('Monstera');
    await expect(products).toHaveCount(1);
    await expect(products.first()).toContainText('Monstera Deliciosa');
    await expect(page).toHaveURL(/\?q=Monstera$/);
  });

  await test.step('Press Reset once and check the catalog', async () => {
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(search).toHaveValue('');
    await expect.soft(products).toHaveCount(unfilteredProductCount);
    await expect.soft(page).toHaveURL(/\/shop\.html$/);
  });
});
