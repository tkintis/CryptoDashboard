import { CoinData } from "../../../features/coins/models/coins.model";

export interface CryptoState {
  coinsCount: number;
  coinsData: CoinData[];
  loading: boolean; 
  error: string | null;
}

export const initialState: CryptoState = {
  coinsCount: 0,
  coinsData: [],
  loading: false,
  error: null,
};