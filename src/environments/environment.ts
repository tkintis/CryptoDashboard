import { Currency } from "../app/shared/enums/currency.enum";

export const environment = {
  production: false,
  apiUrl: 'https://api.coingecko.com/api',
  defaultCurrency: Currency.usd,
  pageSizeOptions: [10, 50, 100],
  topCryptosNumber: 10
};