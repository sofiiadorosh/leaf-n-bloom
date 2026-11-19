const ACTIVE_CLASS = 'dropdown__option_active';

export const initDropdown = (root: HTMLElement): void => {
  const input = root.querySelector<HTMLInputElement>('.dropdown__input');
  const button = root.querySelector<HTMLButtonElement>('.dropdown__button');
  const valueLabel = root.querySelector<HTMLElement>('.dropdown__value');
  const list = root.querySelector<HTMLUListElement>('.dropdown__list');

  if (!input || !button || !valueLabel || !list) {
    return;
  }

  const options = [
    ...list.querySelectorAll<HTMLLIElement>('.dropdown__option'),
  ];
  const defaultValue = input.value;
  let activeIndex = 0;

  const getSelectedIndex = (): number =>
    Math.max(
      options.findIndex((option) => option.dataset.value === input.value),
      0,
    );

  const setActive = (index: number): void => {
    activeIndex = (index + options.length) % options.length;

    options.forEach((option, i) => {
      option.classList.toggle(ACTIVE_CLASS, i === activeIndex);
    });

    const active = options[activeIndex];
    list.setAttribute('aria-activedescendant', active.id);
    active.scrollIntoView({ block: 'nearest' });
  };

  const select = (index: number): void => {
    const option = options[index];

    options.forEach((item) => {
      item.setAttribute('aria-selected', String(item === option));
    });

    input.value = option.dataset.value ?? '';
    valueLabel.textContent = option.textContent?.trim() ?? '';
    root.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const open = (): void => {
    list.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    setActive(getSelectedIndex());
    list.focus();
  };

  const close = (focusButton = true): void => {
    list.hidden = true;
    button.setAttribute('aria-expanded', 'false');

    if (focusButton) {
      button.focus();
    }
  };

  button.addEventListener('click', () => {
    if (list.hidden) {
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

  list.addEventListener('keydown', (event) => {
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

  options.forEach((option, index) => {
    option.addEventListener('mousemove', () => setActive(index));
    option.addEventListener('click', () => {
      select(index);
      close();
    });
  });

  document.addEventListener('click', (event) => {
    if (!list.hidden && !root.contains(event.target as Node)) {
      close(false);
    }
  });

  input.form?.addEventListener('reset', () => {
    input.value = defaultValue;
    select(getSelectedIndex());
    close(false);
  });
};
