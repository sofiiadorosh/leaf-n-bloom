import { CATEGORIES } from '../constants/categories';
import { PRODUCTS } from '../constants/products';
import { getPriceBounds } from '../core/catalog';
import type { Category } from '../core/types';
import { createElement } from './createElement';
import { initDropdown } from './dropdown';

const createCategoryPill = ({ id, name }: Category): HTMLLabelElement =>
  createElement('label', {
    className: 'pill',
    children: [
      createElement('input', {
        className: 'pill__input',
        attributes: { type: 'radio', name: 'category', value: id },
      }),
      createElement('span', { className: 'pill__text', text: name }),
    ],
  });

const renderCategoryPills = (form: HTMLFormElement): void => {
  const container = form.querySelector('.filters__categories');

  if (!container) {
    return;
  }

  container.append(...CATEGORIES.map(createCategoryPill));

  const selected = new URLSearchParams(window.location.search).get('category');
  const input = container.querySelector<HTMLInputElement>(
    `.pill__input[value="${CSS.escape(selected ?? '')}"]`,
  );

  if (input) {
    input.checked = true;
  }
};

const initPriceRange = (form: HTMLFormElement): void => {
  const minInput = form.querySelector<HTMLInputElement>('#price-min');
  const maxInput = form.querySelector<HTMLInputElement>('#price-max');
  const range = form.querySelector<HTMLElement>('.price-range');
  const minOutput = form.querySelector<HTMLOutputElement>(
    '.price-range__value_min',
  );
  const maxOutput = form.querySelector<HTMLOutputElement>(
    '.price-range__value_max',
  );

  if (!minInput || !maxInput || !range || !minOutput || !maxOutput) {
    return;
  }

  const { min, max } = getPriceBounds(PRODUCTS);

  [minInput, maxInput].forEach((input) => {
    input.min = String(min);
    input.max = String(max);
  });
  minInput.defaultValue = String(min);
  maxInput.defaultValue = String(max);
  minInput.value = String(min);
  maxInput.value = String(max);

  const toPercent = (value: number): number =>
    max === min ? 0 : ((value - min) / (max - min)) * 100;

  const update = (): void => {
    const from = Number(minInput.value);
    const to = Number(maxInput.value);

    range.style.setProperty('--from', `${toPercent(from)}%`);
    range.style.setProperty('--to', `${toPercent(to)}%`);
    minOutput.value = `$${from}`;
    maxOutput.value = `$${to}`;
  };

  minInput.addEventListener('input', () => {
    if (Number(minInput.value) > Number(maxInput.value)) {
      minInput.value = maxInput.value;
    }

    update();
  });

  maxInput.addEventListener('input', () => {
    if (Number(maxInput.value) < Number(minInput.value)) {
      maxInput.value = minInput.value;
    }

    update();
  });

  form.addEventListener('reset', () => {
    requestAnimationFrame(update);
  });

  update();
};

const initToggle = (form: HTMLFormElement): void => {
  const button = document.querySelector<HTMLButtonElement>('.filters-toggle');

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') !== 'true';

    button.setAttribute('aria-expanded', String(isOpen));
    form.classList.toggle('filters_open', isOpen);
  });
};

const trackFiltersHeight = (form: HTMLFormElement): void => {
  const update = (): void => {
    form.style.setProperty('--filters-height', `${form.offsetHeight}px`);
  };

  update();
  new ResizeObserver(update).observe(form);
};

export const renderFilters = (): void => {
  const form = document.querySelector<HTMLFormElement>('.filters');

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => event.preventDefault());

  renderCategoryPills(form);
  initPriceRange(form);
  initToggle(form);
  form.querySelectorAll<HTMLElement>('.dropdown').forEach(initDropdown);
  trackFiltersHeight(form);
};
