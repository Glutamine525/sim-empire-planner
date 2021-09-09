import { BuildingChina } from './building-china';
import { BuildingPersian } from './building-persian';
import { CivilType } from './civil';

export const CivilBuilding: { [key in CivilType]: any } = {
  [CivilType.China]: BuildingChina,
  [CivilType.Persian]: BuildingPersian,
  [CivilType.Egypt]: undefined,
  [CivilType.Greece]: undefined,
  [CivilType.Aztec]: undefined,
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

export interface Building {
  Line: number;
  Column: number;
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
