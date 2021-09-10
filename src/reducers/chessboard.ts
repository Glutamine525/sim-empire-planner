import { ActionType } from '@/types/action';
import { CatalogType } from '@/types/building';
import { InitChessboardState, ChessboardAction } from '@/types/state';

const Chessboard = (state = InitChessboardState, action: ChessboardAction) => {
  switch (action.type) {
    case ActionType.PlaceOrDeleteBuilding:
      let { counter } = state;
      const { building, diff } = action;
      if (building.IsRoad) counter.Road++;
      if (!building.IsBarrier && !building.IsRoad) counter.Total += diff;
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
      return { ...state, counter: { ...counter } };
    default:
      return state;
  }
};

export default Chessboard;
