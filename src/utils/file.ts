import store from '@/state';
import { message } from 'antd';

export function stringToBase64(str: string) {
  const encode = encodeURI(str);
  const base64 = btoa(encode);
  return base64;
}

export function base64ToString(base64: string) {
  try {
    const decode = atob(base64);
    const str = decodeURI(decode);
    return str;
  } catch (e) {
    return '';
  }
}

export function getPostfixName() {
  const time = new Date();
  const fullYear = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
  const randoms = Math.random() + '';
  const numberFileName = fullYear + '' + month + date + randoms.slice(3, 10);
  return numberFileName;
}

export function getScreenshotName() {
  const { civil, mapType, isNoWood } = store.getState().map;
  return `模拟帝国-${civil}-${mapType}木-${
    isNoWood ? '无木' : '有木'
  }-${getPostfixName()}`;
}

export function download(blob: Blob, fileName: string) {
  const el = document.getElementById('download');
  if (!el) {
    message.error('页面结构已被破坏，请刷新页面后再截图！');
    return;
  }
  el.setAttribute('href', window.URL.createObjectURL(blob));
  el.setAttribute('download', fileName);
  el.click();
}

// 兼容V2.6以前的存档
export function importTextData() {}

export function importData() {}

export function exportData() {}
