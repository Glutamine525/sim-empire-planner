import { BorderStyleType, Building, CivilBuilding } from '@/types/building';
import { CivilType } from '@/types/civil';
import {
  getBuildingKey,
  isInBuildingRange,
  isInRange,
  parseBuildingKey,
  showMarker,
} from './chessboard';
import { LENGTH } from './config';

interface BuildingInCell extends Building {
  isRoadVertex: boolean;
}

export class Cells {
  static instance: Cells;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Cells();
    }
    return this.instance;
  }

  data!: {
    inRange: boolean;
    occupied: string;
    protection: { [key in string]: string[] };
    building: BuildingInCell;
    marker: number;
  }[][];

  mapType!: number;

  civil!: CivilType;

  isNoWood!: boolean;

  protection!: string[];

  constructor() {
    this.init(5, CivilType.China, false);
  }

  init(mapType: number, civil: CivilType, isNoWood: boolean) {
    this.mapType = mapType;
    this.civil = civil;
    this.isNoWood = isNoWood;
    this.protection = CivilBuilding[civil]['防护'];
    this.data = Array.from(Array(LENGTH + 1), (_, i) =>
      Array.from(Array(LENGTH + 1), (_, j) => {
        return {
          inRange: isInRange(i + 1, j + 1),
          occupied: '',
          protection: {} as { [key in string]: string[] },
          building: {} as BuildingInCell,
          marker: 0,
        };
      })
    );
  }

  canPlace(
    line: number,
    column: number,
    width: number,
    height: number
  ): [boolean, number] {
    let isOccupied = false;
    let records: string[] = [];
    for (let i = line; i < line + height; i++) {
      for (let j = column; j < column + width; j++) {
        if (this.getOccupied(i, j) || !isInRange(i, j)) isOccupied = true;
        for (let v of this.protection) {
          if (this.getProtection(i, j)[v]?.length && !records.includes(v)) {
            records.push(v);
          }
        }
      }
    }
    return [!isOccupied, records.length];
  }

  canReplace(
    line: number,
    column: number,
    width: number,
    height: number
  ): [boolean, number, number, number] {
    const occupied = this.getOccupied(line, column);
    if (!occupied) return [false, -1, -1, -1];
    const [oriLi, oriCo] = parseBuildingKey(occupied);
    const building = this.getBuilding(occupied);
    if (!building.IsGeneral) return [false, -1, -1, -1];
    if (building.Width === width && building.Height === height) {
      return [true, building.Marker, oriLi, oriCo];
    }
    return [false, -1, -1, -1];
  }

  place(building: Building, line: number, column: number) {
    const key = getBuildingKey(building, line, column);
    const { Width, Height, Range, Name } = building;
    let marker = 0;
    for (let i = line; i < line + Height; i++) {
      for (let j = column; j < column + Width; j++) {
        this.data[i][j].occupied = key;
        marker =
          this.data[i][j].marker > marker ? this.data[i][j].marker : marker;
      }
    }
    this.data[line][column].building = { ...building } as BuildingInCell;
    this.data[line][column].building.Marker = marker;

    let records: string[] = [];
    if (building.IsProtection) {
      for (let i = line - Range; i < line + Height + Range; i++) {
        for (let j = column - Range; j < column + Width + Range; j++) {
          if (!isInBuildingRange(i, j, line, column, Width, Height, Range))
            continue;
          if (i < 1 || j < 1) continue;
          if (i > LENGTH || j > LENGTH) continue;
          let cell = this.data[i][j];
          if (cell.protection[Name]) {
            cell.protection[Name].push(key);
          } else {
            cell.protection[Name] = [key];
            cell.marker += 1;
          }
          const { occupied } = cell;
          if (!occupied) continue;
          const [li, co] = parseBuildingKey(occupied);
          const { building: target } = this.data[li][co];
          if (!showMarker(target)) continue;
          if (!records.includes(occupied)) records.push(occupied);
        }
      }
      this.updateRecordMarker(records);
    }

    if (building.IsRoad) {
      this.data[line][column].building.Marker = 1;
      records = this.updateRoadMarker(line, column);
    }

    return { marker, records };
  }

  delete(line: number, column: number, force?: boolean) {
    const { occupied } = this.data[line][column];
    if (!occupied) return [];
    const [oLi, oCo, width, height] = parseBuildingKey(occupied);
    const target = this.getBuilding(oLi, oCo);
    const { Range, Name } = target;

    if (target.IsFixed && !force) return [];

    let record: string[] = [];
    if (target.IsProtection) {
      for (let i = oLi - Range; i < oLi + height + Range; i++) {
        for (let j = oCo - Range; j < oCo + width + Range; j++) {
          if (!isInBuildingRange(i, j, oLi, oCo, width, height, Range)) {
            continue;
          }
          if (i < 1 || j < 1) continue;
          if (i > LENGTH || j > LENGTH) continue;
          let cell = this.data[i][j];
          const { protection: p } = cell;
          p[Name].splice(p[Name].indexOf(occupied), 1);
          if (!p[Name].length) {
            delete p[Name];
            cell.marker -= 1;
          }
          const { occupied: o } = cell;
          if (!o) continue;
          const [li, co] = parseBuildingKey(o);
          const { building: b } = this.data[li][co];
          if (!showMarker(b)) continue;
          if (!record.includes(o)) record.push(o);
        }
      }
      this.updateRecordMarker(record);
    }

    for (let i = oLi; i < oLi + height; i++) {
      for (let j = oCo; j < oCo + width; j++) {
        let cell = this.data[i][j];
        cell.occupied = '';
        cell.building = {} as BuildingInCell;
      }
    }

    if (target.IsRoad) {
      record = this.updateRoadMarker(line, column);
    }

    return record;
  }

  placeBarrier(line: number, column: number) {
    this.data[line][column].occupied = `${line}-${column}-1`;
    this.data[line][column].building = {
      IsFixed: true,
      IsBarrier: true,
      Width: 1,
      Height: 1,
    } as BuildingInCell;
  }

  getCell(line: number, column: number) {
    return this.data[line][column];
  }

  getOccupied(line: number, column: number) {
    if (!isInRange(line, column)) return false;
    return this.data[line][column].occupied;
  }

  getBuilding(arg0: number | string, arg1?: number) {
    if (typeof arg0 === 'string') {
      const [line, column] = parseBuildingKey(arg0);
      return this.data[line][column].building;
    }
    return this.data[arg0][arg1!].building;
  }

  getProtection(line: number, column: number) {
    return this.data[line][column].protection;
  }

  isRoad(line: number, column: number) {
    return !!this.data[line][column].building.IsRoad;
  }

  getRoadDir(line: number, column: number) {
    if (this.isRoad(line, column - 1)) return 'h';
    if (this.isRoad(line, column + 1)) return 'h';
    if (
      this.isRoad(line - 1, column) &&
      !this.isRoad(line - 1, column - 1) &&
      !this.isRoad(line - 1, column + 1)
    )
      return 'v';
    if (
      this.isRoad(line + 1, column) &&
      !this.isRoad(line + 1, column - 1) &&
      !this.isRoad(line + 1, column + 1)
    )
      return 'v';
    return 'n';
  }

  isDirRoad(line: number, column: number, direction: string) {
    if (
      this.isRoad(line, column) &&
      this.getRoadDir(line, column) === direction
    ) {
      return true;
    }
    return false;
  }

  updateRecordMarker(record: string[]) {
    for (let v of record) {
      const [li, co] = parseBuildingKey(v);
      const { building: target } = this.data[li][co];
      let flag: string[] = [];
      for (let i = li; i < li + target.Height; i++) {
        for (let j = co; j < co + target.Width; j++) {
          for (let w of this.protection) {
            if (this.data[i][j].protection[w]?.length && !flag.includes(w)) {
              flag.push(w);
            }
          }
        }
      }
      this.data[li][co].building.Marker = flag.length;
    }
  }

  updateRoadMarker(line: number, column: number) {
    let neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (this.isRoad(line + i, column + j)) {
          neighbors.push({ li: line + i, co: column + j });
        }
      }
    }
    let queue = [];
    for (let v of neighbors) {
      let self = this.getBuilding(v.li, v.co);
      if (this.getRoadDir(v.li, v.co) === 'h') {
        let hasLeft = false;
        if (this.isRoad(v.li, v.co - 1)) {
          let left = this.getBuilding(v.li, v.co - 1);
          let { Marker } = left;
          if (Marker === 1) {
            left.Marker = 1;
            self.Marker = 2;
            left.isRoadVertex = true;
          } else {
            self.Marker = Marker + 1;
            if (Marker > 1) left.isRoadVertex = false;
          }
          self.isRoadVertex = true;
          queue.push(`${v.li}-${v.co - 1}`);
          queue.push(`${v.li}-${v.co}`);
          hasLeft = true;
        }
        if (this.isRoad(v.li, v.co + 1)) {
          let right = this.getBuilding(v.li, v.co + 1);
          let { Marker } = self;
          if (Marker === 1 || !hasLeft) {
            Marker = 1;
            self.Marker = 1;
            right.Marker = 2;
            self.isRoadVertex = true;
          } else {
            right.Marker = Marker + 1;
            if (Marker > 1) self.isRoadVertex = false;
          }
          right.isRoadVertex = true;
          queue.push(`${v.li}-${v.co}`);
          queue.push(`${v.li}-${v.co + 1}`);
          Marker += 2;
          let idx = v.co + 2;
          while (this.isRoad(v.li, idx)) {
            this.getBuilding(v.li, idx).isRoadVertex = true;
            this.getBuilding(v.li, idx).Marker = Marker;
            this.getBuilding(v.li, idx - 1).isRoadVertex = false;
            if (
              !this.isRoad(v.li - 1, idx - 1) &&
              !this.isRoad(v.li + 1, idx - 1)
            ) {
              queue.pop();
            }
            queue.push(`${v.li}-${idx}`);
            Marker++;
            idx++;
          }
        }
      }
    }
    for (let v of neighbors) {
      let self = this.getBuilding(v.li, v.co);
      if (this.getRoadDir(v.li, v.co) === 'v') {
        let hasTop = false;
        if (this.isDirRoad(v.li - 1, v.co, 'v')) {
          let top = this.getBuilding(v.li - 1, v.co);
          let { Marker } = top;
          if (Marker === 1) {
            top.Marker = 1;
            self.Marker = 2;
            top.isRoadVertex = true;
          } else {
            self.Marker = Marker + 1;
            if (Marker > 1) top.isRoadVertex = false;
          }
          self.isRoadVertex = true;
          queue.push(`${v.li - 1}-${v.co}`);
          queue.push(`${v.li}-${v.co}`);
          hasTop = true;
        }
        if (this.isDirRoad(v.li + 1, v.co, 'v')) {
          let bottom = this.getBuilding(v.li + 1, v.co);
          let { Marker } = self;
          if (Marker === 1 || !hasTop) {
            Marker = 1;
            self.Marker = 1;
            bottom.Marker = 2;
            self.isRoadVertex = true;
          } else {
            bottom.Marker = Marker + 1;
            if (Marker > 1) self.isRoadVertex = false;
          }
          bottom.isRoadVertex = true;
          queue.push(`${v.li}-${v.co}`);
          queue.push(`${v.li + 1}-${v.co}`);
          Marker += 2;
          let idx = v.li + 2;
          while (this.isDirRoad(idx, v.co, 'v')) {
            this.getBuilding(idx, v.co).Marker = Marker;
            this.getBuilding(idx, v.co).isRoadVertex = true;
            this.getBuilding(idx - 1, v.co).isRoadVertex = false;
            queue.pop();
            queue.push(`${idx}-${v.co}`);
            Marker++;
            idx++;
          }
        }
      }
      if (this.getRoadDir(v.li, v.co) === 'n') {
        self.isRoadVertex = false;
        self.Marker = 1;
        queue.push(`${v.li}-${v.co}`);
      }
    }
    queue = Array.from(new Set(queue));
    let record: string[] = [];
    for (let v of queue) {
      const [li, co] = parseBuildingKey(v);
      record = record.concat(this.updateRoadDisplay(li, co));
    }
    return Array.from(new Set(record));
  }

  updateRoadDisplay(line: number, column: number) {
    let self = this.getBuilding(line, column);
    const selfDir = this.getRoadDir(line, column);
    if (selfDir === 'h') {
      for (let i = -1; i < 2; i += 2) {
        if (this.isRoad(line + i, column)) {
          let adj = this.getBuilding(line + i, column);
          if (i === -1) {
            adj.BorderBStyle = BorderStyleType.Dashed;
            self.BorderTStyle = BorderStyleType.Dashed;
          } else {
            self.BorderBStyle = BorderStyleType.Dashed;
            adj.BorderTStyle = BorderStyleType.Dashed;
          }
          if (
            this.isDirRoad(line + i, column, 'v') ||
            this.isDirRoad(line + i, column, 'n')
          ) {
            self.isRoadVertex = true;
          }
        }
      }
    } else if (selfDir === 'v') {
      if (this.isDirRoad(line - 1, column, 'v'))
        self.BorderTStyle = BorderStyleType.None;
      else if (this.isDirRoad(line - 1, column, 'h'))
        self.BorderTStyle = BorderStyleType.Dashed;
      else self.BorderTStyle = BorderStyleType.Solid;
      if (this.isDirRoad(line + 1, column, 'v'))
        self.BorderBStyle = BorderStyleType.None;
      else if (this.isDirRoad(line + 1, column, 'h'))
        self.BorderBStyle = BorderStyleType.Dashed;
      else self.BorderBStyle = BorderStyleType.Solid;
    }

    let records: string[] = self.IsRoad ? [`${line}-${column}`] : [];
    if (this.isRoad(line, column - 1)) {
      self.BorderLStyle = BorderStyleType.None;
      records.push(`${line}-${column - 1}`);
    } else self.BorderLStyle = BorderStyleType.Solid;
    if (this.isRoad(line, column + 1)) {
      self.BorderRStyle = BorderStyleType.None;
      records.push(`${line}-${column + 1}`);
    } else self.BorderRStyle = BorderStyleType.Solid;
    if (!this.isRoad(line - 1, column))
      self.BorderTStyle = BorderStyleType.Solid;
    else records.push(`${line - 1}-${column}`);
    if (!this.isRoad(line + 1, column))
      self.BorderBStyle = BorderStyleType.Solid;
    else records.push(`${line + 1}-${column}`);
    return records;
  }
}
