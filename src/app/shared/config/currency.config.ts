import { Currency } from "../enums/currency.enum";

export const CURRENCY_CONFIG: Record<Currency, { symbol: string; locale: string }> = {
    [Currency.usd]: { symbol: '$', locale: 'en-US' },
    [Currency.eur]: { symbol: '€', locale: 'el-GR' },
};
