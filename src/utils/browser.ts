export const DEFAULT_SIZE = {
  width: 1920,
  cellSize: 30,
  fontSize: 62.5,
};

export const $ = (id: string) => document.getElementById(id);

export function getScreenSize() {
  const { clientWidth, clientHeight } = document.documentElement;
  return [clientWidth, clientHeight];
}

export function changeFontSize() {
  const [w] = getScreenSize();
  const { width, cellSize: size, fontSize } = DEFAULT_SIZE;
  const ratio = (size * w) / (width * 3) + fontSize;
  const newVal = ratio < fontSize ? fontSize : ratio;
  document.documentElement.style.fontSize = `${newVal}%`;
}

export function getFontSize() {
  return Number.parseFloat(document.documentElement.style.fontSize);
}

export function getCoord(offsetX: number, offsetY: number) {
  const { cellSize } = DEFAULT_SIZE;
  const column = Math.ceil(offsetX / cellSize);
  const line = Math.ceil(offsetY / cellSize);
  return { line, column };
}
