import { CATEGORIES } from '../../constants/catalog/categories';
import { PRODUCTS } from '../../constants/catalog/products';
import { getPriceBounds } from '../../core/catalog/catalog';
import {
  filtersFromParams,
  filtersToParams,
} from '../../core/catalog/filterParams';
import { parseFilters } from '../../core/catalog/filterProducts';
import type { Category, ProductFilters } from '../../core/types';
import { createElement } from '../shared/createElement';
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
  const categoryPillsContainer = form.querySelector('.filters__categories');

  if (!categoryPillsContainer) {
    return;
  }

  categoryPillsContainer.append(...CATEGORIES.map(createCategoryPill));
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

  const toPercent = (price: number): number =>
    max === min ? 0 : ((price - min) / (max - min)) * 100;

  const updateRangeDisplay = (): void => {
    const minPrice = Number(minInput.value);
    const maxPrice = Number(maxInput.value);

    range.style.setProperty('--from', `${toPercent(minPrice)}%`);
    range.style.setProperty('--to', `${toPercent(maxPrice)}%`);
    minOutput.value = `$${minPrice}`;
    maxOutput.value = `$${maxPrice}`;
  };

  minInput.addEventListener('input', () => {
    if (Number(minInput.value) > Number(maxInput.value)) {
      minInput.value = maxInput.value;
    }

    updateRangeDisplay();
  });

  maxInput.addEventListener('input', () => {
    if (Number(maxInput.value) < Number(minInput.value)) {
      maxInput.value = minInput.value;
    }

    updateRangeDisplay();
  });

  form.addEventListener('reset', () => {
    queueMicrotask(updateRangeDisplay);
  });

  updateRangeDisplay();
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

const setPrice = (
  input: HTMLInputElement | null,
  price: number | null,
): void => {
  if (!input || price === null) {
    return;
  }

  input.value = String(price);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

const applyFilters = (
  form: HTMLFormElement,
  filters: ProductFilters,
  setSort?: (sortValue: string) => void,
): void => {
  const search = form.querySelector<HTMLInputElement>('[name="search"]');
  const petSafe = form.querySelector<HTMLInputElement>('[name="petSafe"]');

  if (search) {
    search.value = filters.search;
  }

  form
    .querySelectorAll<HTMLInputElement>('[name="category"]')
    .forEach((input) => {
      input.checked = input.value === filters.category;
    });

  form.querySelectorAll<HTMLInputElement>('[name="light"]').forEach((input) => {
    input.checked = filters.light.some((level) => level === input.value);
  });

  if (petSafe) {
    petSafe.checked = filters.petSafe;
  }

  setPrice(form.querySelector('#price-max'), filters.priceMax);
  setPrice(form.querySelector('#price-min'), filters.priceMin);
  setSort?.(filters.sort);
};

const writeFiltersToUrl = (filters: ProductFilters): void => {
  const queryString = filtersToParams(
    filters,
    getPriceBounds(PRODUCTS),
  ).toString();
  const url = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;

  window.history.replaceState(null, '', url);
};

const trackFiltersHeight = (form: HTMLFormElement): void => {
  const updateFiltersHeight = (): void => {
    form.style.setProperty('--filters-height', `${form.offsetHeight}px`);
  };

  updateFiltersHeight();
  new ResizeObserver(updateFiltersHeight).observe(form);
};

export const renderFilters = (
  onChange: (filters: ProductFilters) => void,
): void => {
  const form = document.querySelector<HTMLFormElement>('.filters');

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => event.preventDefault());

  renderCategoryPills(form);
  initPriceRange(form);
  initToggle(form);
  const dropdown = form.querySelector<HTMLElement>('.dropdown');
  const setSort = dropdown ? initDropdown(dropdown) : undefined;

  applyFilters(
    form,
    filtersFromParams(new URLSearchParams(window.location.search)),
    setSort,
  );
  trackFiltersHeight(form);

  const notifyFiltersChanged = (): void => {
    const filters = parseFilters(new FormData(form));

    writeFiltersToUrl(filters);
    onChange(filters);
  };

  form.addEventListener('input', notifyFiltersChanged);
  form.addEventListener('change', (event) => {
    if (
      event.target instanceof HTMLInputElement &&
      event.target.type === 'search'
    ) {
      return;
    }

    notifyFiltersChanged();
  });
  form.addEventListener('reset', () => queueMicrotask(notifyFiltersChanged));

  notifyFiltersChanged();
};
