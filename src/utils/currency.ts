import { CURRENCIES, DEFAULT_CURRENCY } from '../types';

export const getCurrencySymbol = (currencyCode?: string): string => {
  if (!currencyCode) return '$';
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
};

export const formatCurrency = (amount: number, currencyCode?: string): string => {
  const symbol = getCurrencySymbol(currencyCode || DEFAULT_CURRENCY);
  // Format number with thousand separators and 2 decimal places
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${symbol}${formattedAmount}`;
};

export const getCurrencyCode = (currencyCode?: string): string => {
  return currencyCode || DEFAULT_CURRENCY;
};
