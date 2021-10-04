export function rgbToHex(color: { r: number; g: number; b: number }) {
  const { r, g, b } = color;
  return `#${decToHex(r)}${decToHex(g)}${decToHex(b)}`;
}

export function rgbaToHex(color: {
  r: number;
  g: number;
  b: number;
  a: number;
}) {
  const { r, g, b, a } = color;
  return `#${decToHex(r)}${decToHex(g)}${decToHex(b)}${decToHex(
    Math.round(a * 255)
  )}`;
}

function decToHex(value: number) {
  let result = value.toString(16);
  if (result.length === 1) result = `0${result}`;
  return result;
}
