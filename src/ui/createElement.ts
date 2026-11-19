import type { ElementOptions, ElementTagNameMap } from '../core/types';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SVG_TAGS: ReadonlySet<string> = new Set(['svg', 'use']);

export const createElement = <Tag extends keyof ElementTagNameMap>(
  tag: Tag,
  { className, text, attributes = {}, children = [] }: ElementOptions = {},
): ElementTagNameMap[Tag] => {
  const element = (
    SVG_TAGS.has(tag)
      ? document.createElementNS(SVG_NAMESPACE, tag)
      : document.createElement(tag)
  ) as ElementTagNameMap[Tag];

  if (className) {
    element.setAttribute('class', className);
  }

  if (text) {
    element.textContent = text;
  }

  Object.entries(attributes).forEach(([name, value]) => {
    element.setAttribute(name, String(value));
  });

  element.append(...children);

  return element;
};
