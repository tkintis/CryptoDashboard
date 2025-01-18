import { createAction, props } from '@ngrx/store';
import { CoinData } from '../../../features/coins/models/coins.model';
import { Currency } from '../../enums/currency.enum';

export const loadCoinsCount = createAction('[Crypto] Load Coins Count');

export const loadCoinsData = createAction('[Crypto] Load Coins Data', props<{ pageSize: number, pageNumber: number, order: string, currency: Currency }>());

export const setCoinsCount = createAction(
    '[Crypto] Set Coins Count',
    props<{ count: number }>()
);

export const setCoinsData = createAction(
    '[Crypto] Set Coins Data',
    props<{ data: CoinData[] }>()
);

export const setCurrency = createAction(
    '[Crypto] Set Currency',
    props<{ currency: Currency }>()
  );