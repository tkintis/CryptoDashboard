import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CryptoState } from '../state/crypto.state';

export const selectCryptoState = createFeatureSelector<CryptoState>('crypto');

export const selectCoinsCount = createSelector(
  selectCryptoState,
  (state) => state.coinsCount
);

export const selectCoinsData = createSelector(
  selectCryptoState,
  (state) => state.coinsData
);

export const selectCurrency = createSelector(
  selectCryptoState,
  (state) => state.currency
);