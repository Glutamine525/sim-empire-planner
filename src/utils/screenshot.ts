import { Building, CivilBuilding, MarkerColor } from '@/types/building';
import { store } from '..';
import { DEFAULT_SIZE } from './browser';
import { parseBuildingKey, showMarker } from './chessboard';
import { LENGTH } from './config';

export const RATIO = 2;

const SVG_XMLNS = 'http://www.w3.org/2000/svg';
const DIV_XMLNS = 'http://www.w3.org/1999/xhtml';

function getBuildingElement(building: Building) {
  let div = document.createElement('div');
  div.innerText = building.Text;
  div.style.width = `${building.Width * 30}px`;
  div.style.height = `${building.Height * 30}px`;
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
  div.style.textAlign = 'center';
  div.style.fontWeight = 'bold';
  div.style.textShadow = Array(10).fill(`${building.Shadow} 0 0 1px`).join(',');
  div.style.transform = `scale(${RATIO}00%)`;
  div.style.transformOrigin = 'top left';
  if (building.IsRoad) {
    div.style.backgroundImage =
      'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAE6SURBVEiJ7VVLEsIwCAWuUZe297+A9+g0LvUYLS4YkeHTVN24MJsyvPBCII/iPM8AME73tgxiwHNZzwcortulLQMiMrPFZF3biZnFjqgwVrEkH4136zzeKl51prwAQNd20k1ip3mJEe9kt3lqPXOc7sxsN2kFJXcX35ZBYm25LYrrdvEuxPN4i52Ruuv9XB1iVz21Pb/q20GUoFhV3xBxB7WGp9aT087A8y2lqHNSxKrOiEfQ+GZsrNjk0nSXcg9GUfdmYuxLjZYuzcXy6trX6qsgO51JeaGnVbJ5RdilnzorrZKembJr3yJ7V6uJGvV2rg77UzRqNVdj1bdv1Si1O6K3iFqtJmo8orcKtbFkZ7TO7q7eInuMJZ3ROn9la1dvDo2x/3+jp/7/G3/03/iWVint20G9RV4b+wB4s+9T4iL+igAAAABJRU5ErkJggg==)';
  }
  return div;
}

function getMarkerElement(marker: number, color: MarkerColor) {
  let div = document.createElement('div');
  div.innerText = marker.toString();
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.color = color;
  div.style.fontFamily = `'PingFang SC', 'Microsoft Yahei', monospace`;
  div.style.fontSize = '10px';
  div.style.position = 'relative';
  div.style.top = '0px';
  div.style.left = '6px';
  div.style.fontWeight = 'bold';
  div.style.textShadow = Array(10).fill('white 0 0 1px').join(',');
  div.style.transform = `scale(${0.8 * RATIO})`;
  div.style.transformOrigin = 'top left';
  return div;
}

async function getImage(width: number, height: number, el: HTMLElement) {
  document.documentElement.append(el);
  const html = `
    <svg width="${width}" height="${height}" xmlns="${SVG_XMLNS}">
      <foreignObject width="100%" height="100%">
        <div xmlns="${DIV_XMLNS}">
          ${htmlToText(el)}
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
      document.documentElement.removeChild(el);
      resolve();
    };
  });
  return img;
}

export async function getBuildingImage(building: Building) {
  if (!Object.keys(building).length) return new Image();
  const { Width, Height } = building;
  const { cellSize } = DEFAULT_SIZE;
  const size = cellSize * RATIO;
  const div = getBuildingElement(building);
  return await getImage(Width * size, Height * size, div);
}

export async function getMarkerImage(marker: number, color: MarkerColor) {
  const { cellSize } = DEFAULT_SIZE;
  const size = cellSize * RATIO;
  const div = getMarkerElement(marker, color);
  return await getImage(size, size, div);
}

export async function getFullSizeImage(
  data: any,
  type: 'barrier' | 'building' | 'marker'
) {
  const { cellSize } = DEFAULT_SIZE;
  const size = LENGTH * cellSize * RATIO;
  let container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '3480px';
  container.style.height = '3480px';
  container.style.transform = `scale(${RATIO}00%)`;
  container.style.transformOrigin = 'top left';
  if (type === 'barrier') {
    Object.keys(data).map(key => {
      const [line, column] = parseBuildingKey(key);
      let div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.boxSizing = 'border-box';
      div.style.width = '3rem';
      div.style.height = '3rem';
      div.style.border = '1px #000000';
      div.style.background = data[key].background;
      div.style.top = `${(line - 1) * 3}rem`;
      div.style.left = `${(column - 1) * 3}rem`;
      div.style.borderTopStyle = data[key].T ? 'solid' : 'none';
      div.style.borderRightStyle = data[key].R ? 'solid' : 'none';
      div.style.borderBottomStyle = data[key].B ? 'solid' : 'none';
      div.style.borderLeftStyle = data[key].L ? 'solid' : 'none';
      container.append(div);
      return null;
    });
  } else if (type === 'building') {
    Object.values(data).map((v: any) => {
      let div = getBuildingElement(v);
      div.style.position = 'absolute';
      div.style.top = `${(v.line - 1) * 3}rem`;
      div.style.left = `${(v.column - 1) * 3}rem`;
      div.style.transform = 'none';
      container.append(div);
      return null;
    });
  } else {
    const { civil } = store.getState().TopMenu;
    const protectionNum = CivilBuilding[civil]['防护'].length;
    Object.values(data).map((v: any) => {
      if ((!showMarker(v) || v.IsFixed) && !v.IsRoad) return null;
      if (v.IsRoad && !v.isRoadVertex) return null;
      let color: MarkerColor =
        v.Marker >= protectionNum ? MarkerColor.Safe : MarkerColor.Danger;
      color = v.IsRoad ? MarkerColor.Normal : color;
      let div = getMarkerElement(v.Marker, color);
      div.style.position = 'absolute';
      div.style.top = `${(v.line - 1) * 3}rem`;
      div.style.left = `${(v.column - 1) * 3 + 0.3}rem`;
      div.style.transform = 'scale(0.8)';
      container.append(div);
      return null;
    });
  }
  return await getImage(size, size, container);
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
    if (['fontFamily', 'backgroundImage'].includes(fName)) {
      value = value.replace(/"/g, '');
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
