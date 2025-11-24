import { CURRENCIES, DEFAULT_CURRENCY } from '../types';

export const getCurrencySymbol = (currencyCode?: string): string => {
  if (!currencyCode) return '$';
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
};

export const formatCurrency = (amount: number, currencyCode?: string): string => {
  const symbol = getCurrencySymbol(currencyCode || DEFAULT_CURRENCY);
  return `${symbol}${amount.toFixed(2)}`;
};

export const getCurrencyCode = (currencyCode?: string): string => {
  return currencyCode || DEFAULT_CURRENCY;
};
