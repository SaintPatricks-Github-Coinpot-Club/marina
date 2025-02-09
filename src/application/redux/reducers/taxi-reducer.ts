import { AnyAction } from 'redux';
import { RESET_TAXI, SET_TAXI_ASSETS } from '../actions/action-types';

export interface TaxiState {
  taxiAssets: string[];
}

export const taxiInitState: TaxiState = {
  taxiAssets: [],
};

export function taxiReducer(
  state: TaxiState = taxiInitState,
  { type, payload }: AnyAction
): TaxiState {
  switch (type) {
    case RESET_TAXI: {
      return taxiInitState;
    }

    case SET_TAXI_ASSETS:
      return { ...state, taxiAssets: payload };

    default:
      return state;
  }
}
