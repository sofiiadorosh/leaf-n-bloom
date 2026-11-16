export const initMenu = (): void => {
  const button = document.querySelector<HTMLButtonElement>('.menu');
  const navigation = document.querySelector<HTMLElement>('.navigation');

  if (!button || !navigation) {
    return;
  }

  const setOpen = (isOpen: boolean): void => {
    navigation.classList.toggle('navigation_open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
    button.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      navigation.classList.contains('navigation_open')
    ) {
      setOpen(false);
      button.focus();
    }
  });
};
