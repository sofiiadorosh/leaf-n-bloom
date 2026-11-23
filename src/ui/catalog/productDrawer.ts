import { EXTRA_CARE } from '../../constants/catalog/extraCare';
import { PRODUCT_FEATURES } from '../../constants/catalog/features';
import { PRODUCTS } from '../../constants/catalog/products';
import { LIGHT_LEVELS } from '../../constants/filters/light';
import { TABLET_MEDIA_QUERY } from '../../constants/shared/breakpoints';
import { MAX_QUANTITY, MIN_QUANTITY } from '../../constants/shared/quantity';
import { cartStore } from '../../core/cart/cartStore';
import {
  clampQuantity,
  formatSize,
  getCareDetails,
  getProductFeatures,
  isPlant,
} from '../../core/catalog/productDetails';
import { formatPrice } from '../../core/formatPrice';
import type { ExtraCareItem, Product, ProductSize } from '../../core/types';
import { createElement } from '../shared/createElement';
import { spriteHref } from '../shared/spriteHref';
import { createRating } from './rating';

const BLOCK = 'product-drawer';
const TITLE_ID = `${BLOCK}-title`;
const OPEN_TIMING: KeyframeAnimationOptions = {
  duration: 420,
  easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
  fill: 'both',
};
const CLOSE_TIMING: KeyframeAnimationOptions = {
  duration: 260,
  easing: 'cubic-bezier(0.4, 0, 1, 1)',
  fill: 'both',
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const tabletQuery = window.matchMedia(TABLET_MEDIA_QUERY);

const createIcon = (
  name: string,
  size: number,
  className?: string,
): SVGSVGElement =>
  createElement('svg', {
    className,
    attributes: { width: size, height: size, 'aria-hidden': 'true' },
    children: [
      createElement('use', { attributes: { href: spriteHref(name) } }),
    ],
  });

const imageSrc = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

const createGallery = ({ name, images }: Product): HTMLElement => {
  const total = images.length;
  const slides = createElement('ul', {
    className: `${BLOCK}__slides`,
    children: images.map((image, index) =>
      createElement('li', {
        className: `${BLOCK}__slide`,
        children: [
          createElement('img', {
            className: `${BLOCK}__image`,
            attributes: {
              src: imageSrc(image),
              alt: `${name}, photo ${index + 1} of ${total}`,
              width: 800,
              height: 800,
            },
          }),
        ],
      }),
    ),
  });

  const thumbButtons = images.map((image, index) =>
    createElement('button', {
      className: `${BLOCK}__thumb`,
      attributes: {
        type: 'button',
        'aria-label': `Show photo ${index + 1} of ${total}`,
      },
      children: [
        createElement('img', {
          attributes: { src: imageSrc(image), alt: '', width: 64, height: 64 },
        }),
      ],
    }),
  );

  let current = 0;

  const update = (index: number): void => {
    current = index;
    thumbButtons.forEach((button, buttonIndex) => {
      button.setAttribute('aria-current', String(buttonIndex === index));
    });
  };

  const show = (index: number): void => {
    const target = Math.min(Math.max(index, 0), total - 1);

    slides.scrollTo({
      left: target * slides.clientWidth,
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
    update(target);
  };

  slides.addEventListener('scroll', () => {
    const index = Math.round(slides.scrollLeft / slides.clientWidth);

    if (index !== current && index >= 0 && index < total) {
      update(index);
    }
  });
  thumbButtons.forEach((button, index) => {
    button.addEventListener('click', () => show(index));
  });

  update(0);

  const hasSeveralPhotos = total > 1;

  return createElement('section', {
    className: `${BLOCK}__gallery`,
    attributes: {
      'aria-roledescription': 'carousel',
      'aria-label': `Photos of ${name}`,
    },
    children: [
      createElement('div', {
        className: `${BLOCK}__viewport`,
        children: [slides],
      }),
      ...(hasSeveralPhotos
        ? [
            createElement('ul', {
              className: `${BLOCK}__thumbs`,
              children: thumbButtons.map((button) =>
                createElement('li', { children: [button] }),
              ),
            }),
          ]
        : []),
    ],
  });
};

const createTabs = (
  description: string,
  careList: HTMLDListElement,
): HTMLDivElement => {
  const sections = [
    {
      id: 'description',
      label: 'Description',
      content: createElement('p', { text: description }),
    },
    { id: 'care', label: 'Care Guide', content: careList },
  ];

  const tabs = sections.map(({ id, label }) =>
    createElement('button', {
      className: `${BLOCK}__tab`,
      text: label,
      attributes: {
        type: 'button',
        role: 'tab',
        id: `${BLOCK}-tab-${id}`,
        'aria-controls': `${BLOCK}-panel-${id}`,
      },
    }),
  );

  const panels = sections.map(({ id, content }) =>
    createElement('div', {
      className: `${BLOCK}__panel`,
      attributes: {
        role: 'tabpanel',
        id: `${BLOCK}-panel-${id}`,
        'aria-labelledby': `${BLOCK}-tab-${id}`,
        tabindex: 0,
      },
      children: [content],
    }),
  );

  const select = (index: number, moveFocus = false): void => {
    tabs.forEach((tab, tabIndex) => {
      const isSelected = tabIndex === index;

      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      panels[tabIndex].hidden = !isSelected;
    });

    if (moveFocus) {
      tabs[index].focus();
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', (event) => {
      const keyTargets: Record<string, number> = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      const target = keyTargets[event.key];

      if (target !== undefined) {
        event.preventDefault();
        select(target, true);
      }
    });
  });

  select(0);

  return createElement('div', {
    className: `${BLOCK}__tabs`,
    children: [
      createElement('div', {
        className: `${BLOCK}__tablist`,
        attributes: { role: 'tablist', 'aria-label': 'Product information' },
        children: tabs,
      }),
      ...panels,
    ],
  });
};

const renderCareList = (
  careList: HTMLDListElement,
  product: Product,
  size: ProductSize,
): void => {
  careList.replaceChildren(
    ...getCareDetails(product, size, LIGHT_LEVELS).map(({ label, value }) =>
      createElement('div', {
        className: `${BLOCK}__care-row`,
        children: [
          createElement('dt', { text: label }),
          createElement('dd', { text: value }),
        ],
      }),
    ),
  );
};

const createFeatures = (product: Product): HTMLUListElement[] => {
  const features = getProductFeatures(product, PRODUCT_FEATURES);

  return features.length
    ? [
        createElement('ul', {
          className: `${BLOCK}__features`,
          attributes: { 'aria-label': 'Features' },
          children: features.map(({ name, icon }) =>
            createElement('li', {
              className: `${BLOCK}__feature`,
              children: [
                createIcon(icon, 20, `${BLOCK}__feature-icon`),
                createElement('span', { text: name }),
              ],
            }),
          ),
        }),
      ]
    : [];
};

const createSizeOptions = (
  product: Product,
  onChange: (size: ProductSize) => void,
): HTMLFieldSetElement =>
  createElement('fieldset', {
    className: `${BLOCK}__options`,
    children: [
      createElement('legend', {
        className: `${BLOCK}__legend`,
        text: isPlant(product) ? 'Select Plant Size' : 'Select Size',
      }),
      createElement('div', {
        className: `${BLOCK}__sizes`,
        children: product.sizes.map((size, index) => {
          const input = createElement('input', {
            className: `${BLOCK}__size-input`,
            attributes: {
              type: 'radio',
              name: 'product-size',
              value: size.inches,
            },
          });

          input.checked = index === 0;
          input.addEventListener('change', () => onChange(size));

          return createElement('label', {
            className: `${BLOCK}__size`,
            children: [
              input,
              createElement('span', {
                className: `${BLOCK}__size-name`,
                text: formatSize(size),
              }),
              createElement('span', {
                className: `${BLOCK}__size-price`,
                text: formatPrice(size.price),
              }),
            ],
          });
        }),
      }),
    ],
  });

const createExtra = ({ id, name, note, price }: ExtraCareItem) =>
  createElement('label', {
    className: `${BLOCK}__extra`,
    children: [
      createElement('input', {
        className: `${BLOCK}__extra-input`,
        attributes: { type: 'checkbox', name: 'extra-care', value: id },
      }),
      createElement('span', {
        className: `${BLOCK}__extra-text`,
        children: [
          createElement('span', {
            className: `${BLOCK}__extra-name`,
            text: name,
          }),
          createElement('span', {
            className: `${BLOCK}__extra-note`,
            text: note,
          }),
        ],
      }),
      createElement('span', {
        className: `${BLOCK}__extra-price`,
        text: formatPrice(price),
      }),
    ],
  });

const createExtras = (product: Product): HTMLFieldSetElement[] =>
  isPlant(product)
    ? [
        createElement('fieldset', {
          className: `${BLOCK}__options`,
          children: [
            createElement('legend', {
              className: `${BLOCK}__legend`,
              children: [
                'Add Extra Care ',
                createElement('span', {
                  className: `${BLOCK}__legend-note`,
                  text: '(Optional)',
                }),
              ],
            }),
            createElement('div', {
              className: `${BLOCK}__extras`,
              children: EXTRA_CARE.map(createExtra),
            }),
          ],
        }),
      ]
    : [];

const createQuantity = (): {
  element: HTMLDivElement;
  getValue: () => number;
} => {
  let quantity = MIN_QUANTITY;
  const value = createElement('span', {
    className: 'quantity__value',
    text: String(quantity),
  });
  const decrease = createElement('button', {
    className: 'quantity__button',
    text: '−',
    attributes: { type: 'button', 'aria-label': 'Decrease quantity' },
  });
  const increase = createElement('button', {
    className: 'quantity__button',
    text: '+',
    attributes: { type: 'button', 'aria-label': 'Increase quantity' },
  });

  const setQuantity = (nextQuantity: number): void => {
    quantity = clampQuantity(nextQuantity);
    value.textContent = String(quantity);
    decrease.disabled = quantity === MIN_QUANTITY;
    increase.disabled = quantity === MAX_QUANTITY;
  };

  decrease.addEventListener('click', () => setQuantity(quantity - 1));
  increase.addEventListener('click', () => setQuantity(quantity + 1));
  setQuantity(MIN_QUANTITY);

  return {
    element: createElement('div', {
      className: 'quantity',
      attributes: { role: 'group', 'aria-label': 'Quantity' },
      children: [decrease, value, increase],
    }),
    getValue: () => quantity,
  };
};

let dialog: HTMLDialogElement | undefined;
let opener: HTMLElement | undefined;
let animations: Animation[] = [];
let isClosing = false;

const announcer = createElement('p', {
  className: 'visually-hidden',
  attributes: { role: 'status' },
});

const getHiddenTransform = (): string =>
  tabletQuery.matches ? 'translateX(100%)' : 'translateY(100%)';

const isRunning = (): boolean =>
  animations.some(({ playState }) => playState === 'running');

const cancelAnimations = (): void => {
  animations.forEach((animation) => animation.cancel());
  animations = [];
};

const animateDrawer = (
  drawer: HTMLDialogElement,
  isOpening: boolean,
): Promise<unknown> => {
  const sheet = drawer.firstElementChild;

  if (reducedMotion.matches || !sheet) {
    cancelAnimations();
    return Promise.resolve();
  }

  const targetsSheet = animations.some(
    ({ effect }) => effect instanceof KeyframeEffect && effect.target === sheet,
  );

  if (isRunning() && targetsSheet) {
    animations.forEach((animation) => animation.reverse());
  } else {
    cancelAnimations();

    const offset = isOpening ? 0 : 1;
    const timing = isOpening ? OPEN_TIMING : CLOSE_TIMING;

    animations = [
      sheet.animate([{ transform: getHiddenTransform(), offset }], timing),
      drawer.animate([{ backgroundColor: 'transparent', offset }], timing),
    ];
  }

  return Promise.all(animations.map(({ finished }) => finished));
};

const finishClose = (): void => {
  dialog?.close();
  cancelAnimations();
  document.body.classList.remove('scroll-locked');
  opener?.focus({ preventScroll: true });
  opener = undefined;
};

const closeProductDrawer = (): void => {
  if (!dialog?.open || isClosing) {
    return;
  }

  isClosing = true;
  animateDrawer(dialog, false)
    .then(() => {
      if (isClosing) {
        finishClose();
      }
    })
    .catch(() => undefined)
    .finally(() => {
      isClosing = false;
    });
};

const getDialog = (): HTMLDialogElement => {
  if (dialog) {
    return dialog;
  }

  dialog = createElement('dialog', {
    className: BLOCK,
    attributes: { 'aria-labelledby': TITLE_ID },
  });

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeProductDrawer();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeProductDrawer();
    }
  });

  document.body.append(dialog, announcer);

  return dialog;
};

const createDrawerContent = (product: Product): HTMLDivElement => {
  const [defaultSize] = product.sizes;
  let selectedSize = defaultSize;

  const price = createElement('p', {
    className: `${BLOCK}__price`,
    text: formatPrice(defaultSize.price),
  });
  const careList = createElement('dl', { className: `${BLOCK}__care` });
  renderCareList(careList, product, defaultSize);

  const quantity = createQuantity();
  const message = createElement('p', {
    className: `${BLOCK}__message`,
    attributes: { role: 'alert' },
  });
  const addButton = createElement('button', {
    className: `button ${BLOCK}__add`,
    attributes: { type: 'button' },
    children: [createIcon('cart', 18), 'Add to Cart'],
  });

  addButton.addEventListener('click', () => {
    const isAdded = cartStore.add(
      { productId: product.id, size: selectedSize.inches },
      quantity.getValue(),
    );

    if (!isAdded) {
      message.textContent = 'This quantity exceeds the cart limit.';
      return;
    }

    if (!cartStore.isSaved()) {
      message.textContent = 'Cart changes may be lost when you leave.';
      return;
    }

    announcer.textContent = `${product.name}, ${formatSize(selectedSize)}, added to cart.`;
    closeProductDrawer();
  });

  const closeButton = createElement('button', {
    className: `${BLOCK}__close`,
    attributes: { type: 'button', 'aria-label': 'Close product details' },
    children: [createIcon('close', 24)],
  });
  closeButton.addEventListener('click', closeProductDrawer);

  return createElement('div', {
    className: `${BLOCK}__sheet`,
    children: [
      closeButton,
      createElement('div', {
        className: `${BLOCK}__content`,
        children: [
          createGallery(product),
          createElement('div', {
            className: `${BLOCK}__body`,
            children: [
              createElement('p', {
                className: `${BLOCK}__tag`,
                text: product.tag,
              }),
              createElement('h2', {
                className: `${BLOCK}__title`,
                text: product.name,
                attributes: { id: TITLE_ID },
              }),
              createRating(product.rating, BLOCK),
              price,
              createTabs(product.description, careList),
              ...createFeatures(product),
              createSizeOptions(product, (size) => {
                selectedSize = size;
                price.textContent = formatPrice(size.price);
                renderCareList(careList, product, size);
              }),
              ...createExtras(product),
            ],
          }),
        ],
      }),
      createElement('div', {
        className: `${BLOCK}__footer`,
        children: [
          createElement('div', {
            className: `${BLOCK}__quantity-row`,
            children: [
              createElement('span', {
                className: `${BLOCK}__legend`,
                text: 'Quantity',
                attributes: { 'aria-hidden': 'true' },
              }),
              quantity.element,
            ],
          }),
          addButton,
          message,
        ],
      }),
    ],
  });
};

export const openProductDrawer = (
  product: Product,
  trigger?: HTMLElement,
): void => {
  const drawer = getDialog();

  isClosing = false;
  drawer.replaceChildren(createDrawerContent(product));
  opener = trigger;
  announcer.textContent = '';

  if (!drawer.open) {
    drawer.showModal();
  }

  document.body.classList.add('scroll-locked');
  animateDrawer(drawer, true).catch(() => undefined);
};

export const renderProductDrawer = (listSelector: string): void => {
  const list = document.querySelector(listSelector);

  list?.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const trigger = event.target.closest<HTMLElement>('[data-open-product]');
    const product = PRODUCTS.find(
      ({ id }) => id === trigger?.dataset.openProduct,
    );

    if (trigger && product) {
      openProductDrawer(product, trigger);
    }
  });
};
