import { formatDistance, parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns';

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace('about ', '')
    .replace('in', 'In');

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

const DEFAULT_CURRENCY_CONFIG = { currency: 'USD', locale: 'en' };

// `formatCurrency` is called from plain render code all over the app, so the
// currency and locale live here as module state rather than in a context. The
// app shell applies the values from the `settings` row before rendering any
// page, and saving a setting invalidates every query so the new format shows
// up right away.
let currencyConfig = { ...DEFAULT_CURRENCY_CONFIG };

export const getCurrencyConfig = () => ({ ...currencyConfig });

export function setCurrencyConfig({ currency, locale } = {}) {
  const next = {
    currency: currency || DEFAULT_CURRENCY_CONFIG.currency,
    locale: locale || DEFAULT_CURRENCY_CONFIG.locale,
  };

  if (
    next.currency === currencyConfig.currency &&
    next.locale === currencyConfig.locale
  )
    return false;

  currencyConfig = next;
  return true;
}

export const formatCurrency = (value) => {
  const amount = Number(value ?? 0);

  try {
    return new Intl.NumberFormat(currencyConfig.locale, {
      style: 'currency',
      currency: currencyConfig.currency,
    }).format(amount);
  } catch {
    // An unknown currency code or locale makes Intl throw, so fall back to the
    // defaults instead of blowing up the page that is only trying to show a price.
    return new Intl.NumberFormat(DEFAULT_CURRENCY_CONFIG.locale, {
      style: 'currency',
      currency: DEFAULT_CURRENCY_CONFIG.currency,
    }).format(amount);
  }
};

// Settings store times as "HH:MM"; show them the way people read them.
export const formatTimeOfDay = (value) => {
  if (!value) return '';

  const [hours, minutes] = String(value).split(':');
  const date = new Date();
  date.setHours(Number(hours) || 0, Number(minutes) || 0, 0, 0);

  try {
    return new Intl.DateTimeFormat(currencyConfig.locale, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return String(value);
  }
};
