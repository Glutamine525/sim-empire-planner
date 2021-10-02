import { BuildingAztec } from './building-aztec';
import { BuildingChina } from './building-china';
import { BuildingColor } from './building-color';
import { BuildingEgypt } from './building-egypt';
import { BuildingGreece } from './building-greece';
import { BuildingPersian } from './building-persian';
import { CivilType } from './civil';

export const CivilBuilding: { [key in CivilType]: any } = {
  [CivilType.China]: BuildingChina,
  [CivilType.Persian]: BuildingPersian,
  [CivilType.Egypt]: BuildingEgypt,
  [CivilType.Greece]: BuildingGreece,
  [CivilType.Aztec]: BuildingAztec,
  [CivilType.Custom]: undefined,
};

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
  ImportExport = '导入导出',
}

export enum BorderStyleType {
  Solid = 'solid',
  Dashed = 'dashed',
  None = 'none',
}

export enum BarrierType {
  Tree = 'tree',
  Water = 'water',
  Mountain = 'mountain',
}

export const BarrierColor = {
  [BarrierType.Tree]: '#92d050',
  [BarrierType.Water]: '#0070c0',
  [BarrierType.Mountain]: '#808080',
};

export enum FixedBuildingType {
  Road = 'road',
  Stone = 'stone',
  Copper = 'copper',
  Wood = 'wood',
  Clay = 'clay',
  Wharf = 'wharf',
}

export const FixedBuildingColor = {
  [FixedBuildingType.Road]: '',
  [FixedBuildingType.Stone]: '#d9d9d9',
  [FixedBuildingType.Copper]: '#ffd966',
  [FixedBuildingType.Wood]: '#00b050',
  [FixedBuildingType.Clay]: '#ed7d31',
  [FixedBuildingType.Wharf]: '#00b0f0',
};

export const FixedBuildingText = {
  [FixedBuildingType.Road]: '',
  [FixedBuildingType.Stone]: '采石场',
  [FixedBuildingType.Copper]: '铜矿场',
  [FixedBuildingType.Wood]: '伐木场',
  [FixedBuildingType.Clay]: '粘土矿',
  [FixedBuildingType.Wharf]: '码头',
};

export const FixedBuildingSize = {
  [FixedBuildingType.Road]: 1,
  [FixedBuildingType.Stone]: 2,
  [FixedBuildingType.Copper]: 2,
  [FixedBuildingType.Wood]: 2,
  [FixedBuildingType.Clay]: 2,
  [FixedBuildingType.Wharf]: 3,
};

export const FixedBuildingCatalog = {
  [FixedBuildingType.Road]: CatalogType.Road,
  [FixedBuildingType.Stone]: CatalogType.Industry,
  [FixedBuildingType.Copper]: CatalogType.Industry,
  [FixedBuildingType.Wood]: CatalogType.Industry,
  [FixedBuildingType.Clay]: CatalogType.Industry,
  [FixedBuildingType.Wharf]: CatalogType.Agriculture,
};

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
