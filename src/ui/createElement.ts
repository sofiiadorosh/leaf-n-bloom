import type { ElementOptions } from '../core/types';

export const createElement = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  { className, text, attributes = {}, children = [] }: ElementOptions = {},
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, String(value));
  });

  element.append(...children);

  return element;
};
