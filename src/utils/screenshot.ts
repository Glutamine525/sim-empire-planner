import { Building, MarkerColor } from '@/types/building';
import { $, DEFAULT_SIZE } from './browser';

export const RATIO = 4;

const SVG_XMLNS = 'http://www.w3.org/2000/svg';
const DIV_XMLNS = 'http://www.w3.org/1999/xhtml';

export async function getBuildingImage(building: Building) {
  const { Width, Height } = building;
  const { cellSize } = DEFAULT_SIZE;
  const size = cellSize * RATIO;
  let div = document.createElement('div');
  div.innerText = building.Text;
  div.style.width = `${Width * 30}px`;
  div.style.height = `${Height * 30}px`;
  div.style.color = building.Color;
  div.style.fontFamily = `'PingFang SC', 'Microsoft Yahei', monospace`;
  div.style.fontSize = `${building.FontSize * 10}px`;
  div.style.background = building.Background;
  div.style.borderWidth = `${building.BorderWidth * 10}px`;
  div.style.borderColor = building.BorderColor;
  div.style.borderTopStyle = building.BorderTStyle;
  div.style.borderRightStyle = building.BorderRStyle;
  div.style.borderBottomStyle = building.BorderBStyle;
  div.style.borderLeftStyle = building.BorderLStyle;
  div.style.boxSizing = 'border-box';
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.alignItems = 'center';
  div.style.fontWeight = 'bold';
  div.style.textShadow = 'white 0 1px 10px';
  div.style.transform = `scale(${RATIO}00%)`;
  div.style.transformOrigin = 'top left';
  document.documentElement.append(div);
  const html = `
    <svg width="${Width * size}" height="${Height * size}" xmlns="${SVG_XMLNS}">
      <foreignObject width="100%" height="100%">
        <div xmlns="${DIV_XMLNS}">
          ${htmlToText(div)}
        </div>
      </foreignObject>
    </svg>`;

  // const svg = new Blob([html], {
  //   type: 'image/svg+xml;charset=utf-8',
  // });
  // const url = window.URL.createObjectURL(svg);
  // console.log(url);

  let img = new Image();
  img.src =
    'data:image/svg+xml;base64,' +
    window.btoa(unescape(encodeURIComponent(html)));
  await new Promise<void>(resolve => {
    img.onload = () => {
      document.documentElement.removeChild(div);
      resolve();
    };
  });
  return img;
}

export async function getMarkerImage(marker: number, color: MarkerColor) {
  const size = 30 * RATIO;
  let div = document.createElement('div');
  div.innerText = marker.toString();
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.color = color;
  div.style.fontFamily = `'PingFang SC', 'Microsoft Yahei', monospace`;
  div.style.fontSize = '10px';
  div.style.position = 'relative';
  div.style.top = '0px';
  div.style.left = '12px';
  div.style.fontWeight = 'bold';
  div.style.textShadow = 'white 0px 1px 10px';
  div.style.transform = `scale(${0.8 * RATIO})`;
  div.style.transformOrigin = 'top left';
  document.documentElement.append(div);
  const html = `
    <svg width="${size}" height="${size}" xmlns="${SVG_XMLNS}">
      <foreignObject width="100%" height="100%">
        <div xmlns="${DIV_XMLNS}">
          ${htmlToText(div)}
        </div>
      </foreignObject>
    </svg>`;

  const svg = new Blob([html], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = window.URL.createObjectURL(svg);
  console.log(url);

  let img = new Image();
  img.src =
    'data:image/svg+xml;base64,' +
    window.btoa(unescape(encodeURIComponent(html)));
  await new Promise<void>(resolve => {
    img.onload = () => {
      document.documentElement.removeChild(div);
      resolve();
    };
  });
  return img;
}

function htmlToText(node: Element | Text) {
  if (node.nodeName === '#text') return (node as Text).data;
  const nodeName = node.nodeName.toLowerCase();
  const style = styleToString(node as Element, [
    'box-sizing',
    'position',
    'top',
    'left',
    'display',
    'align-items',
    'justify-content',
    'width',
    'height',
    'font-size',
    'font-family',
    'font-weight',
    'color',
    'text-align',
    'text-shadow',
    'background-color',
    'background-image',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'transform',
    'transform-origin',
  ]);
  let txt = `<${nodeName} style="${style}">`;
  const { childNodes } = node;
  for (let i = 0, l = childNodes.length; i < l; i++) {
    txt += htmlToText(childNodes[i] as Element | Text);
  }
  txt += `</${nodeName}>`;
  return txt;
}

function styleToString(node: Element, styleNames: string[]) {
  const css = window.getComputedStyle(node);
  const style = [];
  for (const name of styleNames) {
    const fName = separatorToCamelNaming(name);
    let value = css[fName as any];
    // if (['top', 'left'].includes(fName) && node.className !== 'marker')
    //   continue;
    if (fName === 'fontFamily') {
      value = value.replace(/"/g, '');
    } else if (fName === 'backgroundImage') {
      value = value.replace(/"/g, "'");
    }
    style.push(`${name}: ${value};`);
  }
  return style.join(' ');
}

function separatorToCamelNaming(name: string) {
  const nameArr = name.split(/-/g);
  let newName = '';
  for (let i = 0, j = nameArr.length; i < j; i++) {
    const item = nameArr[i];
    if (i === 0) {
      newName += item;
    } else {
      newName += `${item[0].toLocaleUpperCase()}${item.substr(1)}`;
    }
  }
  return newName;
}
