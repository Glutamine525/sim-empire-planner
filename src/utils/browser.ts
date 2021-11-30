import { message } from 'antd';

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

export function copyText(text: string) {
  let textarea = document.createElement('textarea');
  const currentFocus = document.activeElement;
  // const toolboxWrapper = document.getElementById('map');
  const toolboxWrapper = document.documentElement;
  toolboxWrapper!.appendChild(textarea);
  textarea.value = text;
  textarea.focus();
  if ('setSelectionRange' in textarea) {
    textarea.setSelectionRange(0, textarea.value.length);
  } else {
    textarea.select();
  }
  let flag = true;
  try {
    flag = document.execCommand('copy');
  } catch (_) {
    flag = false;
  }
  toolboxWrapper!.removeChild(textarea);
  (currentFocus as any).focus();
  return flag;
}

export function copyLink(link: string) {
  if (copyText(link)) message.success('已复制该链接！');
  else message.error('复制链接失败！');
}
