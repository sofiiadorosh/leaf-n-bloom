export const renderFooter = (): void => {
  const year = document.querySelector<HTMLElement>('.footer__year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
};
