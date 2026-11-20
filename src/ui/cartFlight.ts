import { createElement } from './createElement';

const CART_FLIGHT = {
  durationMs: 520,
  easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  arcHeightPx: 32,
  arcProgress: 0.55,
  startScale: 0.8,
  endScale: 0.55,
} as const;

const translateFromCenter = (x: number, y: number): string =>
  `calc(${x}px - 50%) calc(${y}px - 50%)`;

export const animateCartFlight = (
  button: HTMLButtonElement,
  cartIcon: Element,
): Animation | undefined => {
  const destination = cartIcon.getBoundingClientRect();

  if (
    !destination.width ||
    destination.top < 0 ||
    destination.bottom > window.innerHeight ||
    destination.left < 0 ||
    destination.right > window.innerWidth
  ) {
    return;
  }

  const buttonIcon = button.querySelector('svg');

  if (!buttonIcon) {
    return;
  }

  const origin = buttonIcon.getBoundingClientRect();
  const originX = origin.left + origin.width / 2;
  const originY = origin.top + origin.height / 2;

  const destinationX = destination.left + destination.width / 2;
  const destinationY = destination.top + destination.height / 2;

  const arcX = originX + (destinationX - originX) * CART_FLIGHT.arcProgress;
  const arcY =
    originY +
    (destinationY - originY) * CART_FLIGHT.arcProgress -
    CART_FLIGHT.arcHeightPx;

  const flyer = createElement('span', {
    className: 'shop__cart-flight',
    attributes: { 'aria-hidden': 'true' },
    children: [buttonIcon.cloneNode(true)],
  });

  document.body.append(flyer);

  const flight = flyer.animate(
    [
      {
        translate: translateFromCenter(originX, originY),
        scale: CART_FLIGHT.startScale,
      },
      {
        translate: translateFromCenter(arcX, arcY),
        scale: 1,
      },
      {
        translate: translateFromCenter(destinationX, destinationY),
        scale: CART_FLIGHT.endScale,
        opacity: 0,
      },
    ],
    {
      duration: CART_FLIGHT.durationMs,
      easing: CART_FLIGHT.easing,
    },
  );

  const removeFlyer = (): void => flyer.remove();
  flight.addEventListener('finish', removeFlyer);
  flight.addEventListener('cancel', removeFlyer);

  return flight;
};
