import { State } from '@/state';
import { AppActionCreators, MapActionCreators } from '@/state/actions';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

export function usePrevState(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useValue<T>(selector: (state: State) => T) {
  return useSelector<State, T>(selector);
}

export function useAppCreators() {
  return bindActionCreators(AppActionCreators, useDispatch());
}

export function useMapCreators() {
  return bindActionCreators(MapActionCreators, useDispatch());
}
