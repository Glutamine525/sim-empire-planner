import { ActionType } from '@/state/actions';
import { Building, CatalogType } from '@/types/building';
import { Counter } from '@/types/couter';

export interface ChessboardAction {
  type: ActionType;
  buildings: Building[];
  diff: number;
  copiedBuilding: Building;
  counter: Counter;
}

export const InitChessboardState: ChessboardAction = {
  type: ActionType.Empty,
  buildings: [] as Building[],
  diff: 1,
  copiedBuilding: {} as Building,
  counter: {
    OridinaryHouse: 0,
    HighEndHouse: 0,
    Barn: 0,
    Warehouse: 0,
    Agriculture: 0,
    Industry: 0,
    General: 0,
    Fixed: 0,
    Total: 0,
    Road: 0,
    OccupiedCells: 0,
  },
};

const Chessboard = (state = InitChessboardState, action: ChessboardAction) => {
  switch (action.type) {
    case ActionType.ResetCouter:
      return {
        ...state,
        counter: {
          OridinaryHouse: 0,
          HighEndHouse: 0,
          Barn: 0,
          Warehouse: 0,
          Agriculture: 0,
          Industry: 0,
          General: 0,
          Fixed: 0,
          Total: 0,
          Road: 0,
          OccupiedCells: 0,
        },
      };
    case ActionType.PlaceOrDeleteBuilding:
      let { counter } = state;
      const { buildings, diff } = action;
      buildings.forEach(building => {
        if (building.IsRoad) counter.Road += diff;
        if (!building.IsBarrier && !building.IsRoad) counter.Total += diff;
        if (!building.IsBarrier && !building.IsRoad && building.IsFixed)
          counter.Fixed += diff;
        if (building.Catalog === CatalogType.Residence) {
          if (building.Name === '普通住宅') counter.OridinaryHouse += diff;
          else if (building.Name === '高级住宅') counter.HighEndHouse += diff;
        }
        if (building.Catalog === CatalogType.Municipal) {
          if (building.Name === '粮仓') counter.Barn += diff;
          else if (building.Name === '货栈') counter.Warehouse += diff;
        }
        if (building.Catalog === CatalogType.Agriculture)
          counter.Agriculture += diff;
        if (building.Catalog === CatalogType.Industry) counter.Industry += diff;
        if (building.Catalog === CatalogType.General) counter.General += diff;
        if (!building.IsBarrier)
          counter.OccupiedCells += diff * building.Width * building.Height;
      });
      return { ...state, counter: { ...counter } };
    case ActionType.ChangeCopiedBuilding:
      return {
        ...state,
        copiedBuilding: action.copiedBuilding,
      };
    default:
      return state;
  }
};

export default Chessboard;
