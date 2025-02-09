import {
  SET_DEEP_RESTORER_IS_LOADING,
  WALLET_SET_DATA,
  SET_DEEP_RESTORER_GAP_LIMIT,
  SET_DEEP_RESTORER_ERROR,
  START_DEEP_RESTORATION,
  NEW_ADDRESS_SUCCESS,
  NEW_CHANGE_ADDRESS_SUCCESS,
  SET_VERIFIED,
  SET_UPDATER_LOADER,
} from './action-types';
import { AnyAction } from 'redux';
import { WalletData } from '../../utils/wallet';

export function setWalletData(walletData: WalletData): AnyAction {
  return {
    type: WALLET_SET_DATA,
    payload: walletData,
  };
}

export function incrementAddressIndex(): AnyAction {
  return { type: NEW_ADDRESS_SUCCESS };
}

export function incrementChangeAddressIndex(): AnyAction {
  return { type: NEW_CHANGE_ADDRESS_SUCCESS };
}

export function setDeepRestorerIsLoading(isLoading: boolean): AnyAction {
  return {
    type: SET_DEEP_RESTORER_IS_LOADING,
    payload: { isLoading },
  };
}

export function setDeepRestorerGapLimit(gapLimit: number): AnyAction {
  return {
    type: SET_DEEP_RESTORER_GAP_LIMIT,
    payload: { gapLimit },
  };
}

export function setDeepRestorerError(error: Error | undefined): AnyAction {
  return {
    type: SET_DEEP_RESTORER_ERROR,
    payload: { error: error ? error.message : undefined },
  };
}

export function startDeepRestorer(): AnyAction {
  return {
    type: START_DEEP_RESTORATION,
  };
}

export function setVerified(): AnyAction {
  return { type: SET_VERIFIED };
}

const setUpdaterLoader =
  (loader: string) =>
  (isLoading: boolean): AnyAction => ({
    type: SET_UPDATER_LOADER,
    payload: { loader, isLoading },
  });

export const setUtxosUpdaterLoader = setUpdaterLoader('utxos');
export const setTransactionsUpdaterLoader = setUpdaterLoader('transactions');
