import { BuildingAztec } from './building-aztec';
import { BuildingChina } from './building-china';
import { BuildingColor } from './building-color';
import { BuildingEgypt } from './building-egypt';
import { BuildingGreece } from './building-greece';
import { BuildingPersian } from './building-persian';
import { CivilType } from './civil';

export const CivilBuilding: { [key in CivilType]: typeof BuildingChina } = {
  [CivilType.China]: BuildingChina,
  [CivilType.Persian]: BuildingPersian,
  [CivilType.Egypt]: BuildingEgypt,
  [CivilType.Greece]: BuildingGreece,
  [CivilType.Aztec]: BuildingAztec,
  [CivilType.Custom]: undefined as any,
};

export enum BuildingType {
  Residence = '住宅',
  Agriculture = '农业',
  Industry = '工业',
  Commerce = '商业',
  Municipal = '市政',
  Culture = '文化',
  Religion = '宗教',
  Military = '军事',
  Decoration = '美化',
  Wonder = '奇迹',
}

export enum CatalogType {
  Road = '道路',
  Residence = '住宅',
  Agriculture = '农业',
  Industry = '工业',
  Commerce = '商业',
  Municipal = '市政',
  Culture = '文化',
  Religion = '宗教',
  Military = '军事',
  Decoration = '美化',
  Wonder = '奇迹',
  General = '通用',
  Special = '特殊建筑',
  Cancel = '取消操作',
  Select = '选中建筑',
  Delete = '删除建筑',
  Watermark = '水印模式',
  ImportExport = '导入导出',
}

export enum BorderStyleType {
  Solid = 'solid',
  Dashed = 'dashed',
  None = 'none',
}

export interface SimpleBuilding {
  name: string;
  text?: string;
  size?: number;
  width?: number;
  height?: number;
  range?: number;
  color?: string;
  background?: string;
  fontSize?: number;
  isRoad?: boolean;
  isWonder?: boolean;
  isDecoration?: boolean;
  isPalace?: boolean;
}

export interface Building {
  Name: string;
  Text: string;
  Range: number;
  Marker: number;
  Catalog: CatalogType;
  IsFixed: boolean;
  IsBarrier: boolean;
  IsRoad: boolean;
  IsProtection: boolean;
  IsWonder: boolean;
  IsDecoration: boolean;
  IsGeneral: boolean;
  // css
  Width: number;
  Height: number;
  Color: string;
  FontSize: number;
  Background: string;
  BorderColor: string;
  BorderWidth: number;
  BorderTStyle: BorderStyleType;
  BorderRStyle: BorderStyleType;
  BorderBStyle: BorderStyleType;
  BorderLStyle: BorderStyleType;
}

export enum MarkerColor {
  Normal = 'black',
  Danger = 'var(--ant-error-color)',
  Safe = 'var(--ant-success-color)',
}

export const GeneralBuilding = [
  {
    name: '2x2建筑',
    text: '2x2',
    size: 2,
    range: 0,
    background: BuildingColor['通用'][0],
  },
  {
    name: '3x3建筑',
    text: '3x3',
    size: 3,
    range: 0,
    background: BuildingColor['通用'][1],
  },
  {
    name: '4x4建筑',
    text: '4x4',
    size: 4,
    range: 0,
    background: BuildingColor['通用'][2],
  },
  {
    name: '5x5建筑',
    text: '5x5',
    size: 5,
    range: 0,
    background: BuildingColor['通用'][3],
  },
];
