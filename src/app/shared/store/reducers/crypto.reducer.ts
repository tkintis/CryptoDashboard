import { createReducer, on } from '@ngrx/store';
import { initialState } from '../state/crypto.state';
import * as CryptoActions from '../actions/crypto.actions';

export const cryptoReducer = createReducer(
  initialState,
  on(CryptoActions.setCoinsCount, (state, { count }) => ({
    ...state,
    coinsCount: count
  })),
  on(CryptoActions.setCoinsData, (state, { data }) => ({
    ...state,
    coinsData: data,
  })),
  on(CryptoActions.setCurrency, (state, { currency }) => ({
    ...state,
    currency: currency,
  }))

)
