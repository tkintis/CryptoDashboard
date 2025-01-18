import { environment } from "../../../../environments/environment";
import { CoinData } from "../../../features/coins/models/coins.model";
import { Currency } from "../../enums/currency.enum";

export interface CryptoState {
  coinsData: CoinData[];
  coinsCount: number;
  currency: Currency;
}

export const initialState: CryptoState = {
  coinsData: [],
  coinsCount: 0,
  currency: environment.defaultCurrency,
};
