const ACTIVE_CLASS = 'dropdown__option_active';

export const initDropdown = (
  root: HTMLElement,
): ((sortValue: string) => void) | undefined => {
  const input = root.querySelector<HTMLInputElement>('.dropdown__input');
  const button = root.querySelector<HTMLButtonElement>('.dropdown__button');
  const valueLabel = root.querySelector<HTMLElement>('.dropdown__value');
  const optionsList = root.querySelector<HTMLUListElement>('.dropdown__list');

  if (!input || !button || !valueLabel || !optionsList) {
    return;
  }

  const options = [
    ...optionsList.querySelectorAll<HTMLLIElement>('.dropdown__option'),
  ];
  const defaultSortValue = input.value;
  let activeIndex = 0;

  const getSelectedIndex = (): number =>
    Math.max(
      options.findIndex((option) => option.dataset.value === input.value),
      0,
    );

  const setActive = (optionIndex: number): void => {
    activeIndex = (optionIndex + options.length) % options.length;

    options.forEach((option, i) => {
      option.classList.toggle(ACTIVE_CLASS, i === activeIndex);
    });

    const activeOption = options[activeIndex];
    optionsList.setAttribute('aria-activedescendant', activeOption.id);
    activeOption.scrollIntoView({ block: 'nearest' });
  };

  const select = (optionIndex: number): void => {
    const selectedOption = options[optionIndex];

    options.forEach((option) => {
      option.setAttribute('aria-selected', String(option === selectedOption));
    });

    input.value = selectedOption.dataset.value ?? '';
    valueLabel.textContent = selectedOption.textContent?.trim() ?? '';
    root.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const open = (): void => {
    optionsList.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    setActive(getSelectedIndex());
    optionsList.focus();
  };

  const close = (focusButton = true): void => {
    optionsList.hidden = true;
    button.setAttribute('aria-expanded', 'false');

    if (focusButton) {
      button.focus();
    }
  };

  button.addEventListener('click', () => {
    if (optionsList.hidden) {
      open();
    } else {
      close();
    }
  });

  button.addEventListener('keydown', (event) => {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      open();
    }
  });

  optionsList.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive(activeIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(activeIndex);
        close();
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close(false);
        break;
      default:
        break;
    }
  });

  options.forEach((option, optionIndex) => {
    option.addEventListener('mousemove', () => setActive(optionIndex));
    option.addEventListener('click', () => {
      select(optionIndex);
      close();
    });
  });

  document.addEventListener('click', (event) => {
    if (!optionsList.hidden && !root.contains(event.target as Node)) {
      close(false);
    }
  });

  input.form?.addEventListener('reset', () => {
    input.value = defaultSortValue;
    select(getSelectedIndex());
    close(false);
  });

  return (sortValue: string): void => {
    const optionIndex = options.findIndex(
      (option) => option.dataset.value === sortValue,
    );

    if (optionIndex >= 0) {
      select(optionIndex);
    }
  };
};
