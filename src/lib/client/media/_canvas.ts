import type { Options } from 'html2canvas';

import { dev } from '$app/environment';

interface CreateCanvasOptions {
  backgroundColor?: string;
  ignoredTagNames?: string[];
  ignoredClassNames?: string[];
  ignoreElements?: (element: Element) => boolean;
  onClone?: Options['onclone'];
  scale?: number;
}

export async function createCanvas(
  element: HTMLElement,
  {
    backgroundColor,
    ignoreElements = () => false,
    ignoredClassNames = [],
    ignoredTagNames = [],
    onClone,
    scale,
  }: CreateCanvasOptions = {},
): Promise<HTMLCanvasElement> {
  const html2Canvas = (await import('html2canvas')).default;

  let bgColor = backgroundColor;
  if (!bgColor) {
    const style = getComputedStyle(document.body);
    bgColor = style.getPropertyValue('--color-bg-body');
  }

  const canvas = await html2Canvas(element, {
    backgroundColor: bgColor,
    ignoreElements(element) {
      if (ignoreElements(element)) return true;
      const { classList, tagName } = element;
      return (
        ignoredTagNames.includes(tagName) ||
        ignoredClassNames.some((className) => classList.contains(className))
      );
    },
    logging: dev,
    onclone: onClone,
    scale,
    useCORS: true,
  });

  return canvas;
}
