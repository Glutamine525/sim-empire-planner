export const LENGTH = 116;

export function getFontSize() {
  return Number.parseInt(
    getComputedStyle(window.document.documentElement)['font-size' as any]
  );
}
