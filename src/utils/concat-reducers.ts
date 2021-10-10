import objectAssign from 'object-assign';

function isObject(value: any) {
  return (
    typeof value !== 'undefined' &&
    value !== null &&
    value.constructor === Object
  );
}

export default function concatReducers(reducers: any) {
  const empty = reducers.length === 0;
  function applyNextState(previousState: any, nextState: any) {
    if (isObject(previousState) && isObject(nextState)) {
      return objectAssign(previousState, nextState);
    } else {
      return nextState;
    }
  }
  function checkHasChanged(previousState: any, nextState: any) {
    if (isObject(previousState) && isObject(nextState)) {
      if (previousState === nextState) {
        return false;
      } else {
        const keys = Object.keys(nextState);
        for (let i = 0; i < keys.length; i++) {
          if (previousState[keys[i]] !== nextState[keys[i]]) {
            return true;
          }
        }
        return false;
      }
    } else {
      return previousState !== nextState;
    }
  }
  return function (state: any, action: any) {
    if (empty) {
      throw Error('There are no reducers');
    }
    let finalNextState = isObject(state) ? objectAssign({}, state) : state;
    let hasChanged = false;
    function getPreviousState() {
      return typeof state === 'undefined' ? state : finalNextState;
    }
    for (let i = 0; i < reducers.length; i++) {
      const nextState = reducers[i](getPreviousState(), action);
      if (checkHasChanged(finalNextState, nextState)) {
        hasChanged = true;
        finalNextState = applyNextState(finalNextState, nextState);
      }
    }

    return hasChanged ? finalNextState : state;
  };
}
