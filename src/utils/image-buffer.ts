import store from '@/state';
import {
  Building,
  BuildingType,
  CatalogType,
  CivilBuilding,
  GeneralBuilding,
  MarkerColor,
} from '@/types/building';
import { CivilType } from '@/types/civil';

import { converToBuilding, getRoadImageBuffer } from './chessboard';
import { LENGTH } from './config';
import { getBuildingImage } from './screenshot';

type buildingKey = BuildingType & CatalogType.General & CatalogType.Special;

export default class ImageBuffer {
  static instance: ImageBuffer;

  static getInstance() {
    if (!this.instance) this.instance = new ImageBuffer(CivilType.China);
    return this.instance;
  }

  road!: { [key: string]: Promise<HTMLImageElement> };
  building!: {
    [key in buildingKey]: { [key: string]: Promise<HTMLImageElement> };
  };
  marker!: { [key in MarkerColor]: Promise<HTMLImageElement>[] };

  constructor(civil: CivilType) {
    this.road = getRoadImageBuffer();
    this.update(civil, true);
  }

  async get(
    type: 'road' | 'building' | 'marker',
    index0: string,
    index1?: string | number
  ) {
    const { civil } = store.getState().map;
    console.log({ type, index0, index1, civil });
    if (type === 'road') {
      return await this.road[index0];
    } else if (type === 'building') {
      if ((this.building as any)[index0][index1!] === null) {
        const { specials, civil } = store.getState().map;
        if (index0 === CatalogType.Special) {
          const b = specials.find(v => v.name === index1)!;
          (this.building as any)[index0][index1!] = getBuildingImage(
            converToBuilding(CatalogType.Special, b)
          );
        } else if (index0 === CatalogType.General) {
          const b = GeneralBuilding.find(v => v.name === index1)!;
          (this.building as any)[index0][index1!] = getBuildingImage(
            converToBuilding(CatalogType.Special, b)
          );
        } else {
          (this.building as any)[index0][index1!] = getBuildingImage(
            converToBuilding(
              index0 as CatalogType,
              CivilBuilding[civil][index0 as buildingKey][index1!]
            )
          );
        }
      }
      return await (this.building as any)[index0][index1!];
    } else if (type === 'marker') {
      return await this.marker[index0 as MarkerColor][index1 as number];
    }
  }

  update(civil: CivilType, init?: boolean) {
    this.updateBuilding(civil, init);
    this.updateMarker(civil, init);
  }

  updateBuilding(civil: CivilType, init?: boolean) {
    let result = {
      [CatalogType.General]: {},
      [CatalogType.Special]: {},
    } as any;
    Object.values(BuildingType).forEach(v => {
      result[v] = {};
      CivilBuilding[civil][v].forEach(w => (result[v][w.name] = null as any));
    });
    if (init) {
      GeneralBuilding.forEach(
        v => (result[CatalogType.General][v.name] = null as any)
      );
    } else {
      result[CatalogType.General] = (this.building as any)[CatalogType.General];
      result[CatalogType.Special] = (this.building as any)[CatalogType.Special];
    }
    this.building = result;
  }

  updateSpecialBuilding(building: Building, cmd: string) {
    if (cmd === 'insert') {
      (this.building as any)[CatalogType.Special][building.Name] = null;
    } else if (cmd === 'delete') {
      const index = (this.building as any)[CatalogType.Special].indexOf(
        building.Name
      );
      (this.building as any)[CatalogType.Special].splice(index, 1);
    }
  }

  updateMarker(civil: CivilType, init?: boolean) {
    const num = CivilBuilding[civil]['防护'].length + 1;
    this.marker = {
      [MarkerColor.Normal]: init
        ? (Array.from(Array(LENGTH + 1), () => null) as any[])
        : this.marker[MarkerColor.Normal],
      [MarkerColor.Safe]: Array.from(Array(num), () => null) as any[],
      [MarkerColor.Danger]: Array.from(Array(num), () => null) as any[],
    };
  }
}
