const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatPrice = (dollars: number): string =>
  usdFormatter.format(dollars);
