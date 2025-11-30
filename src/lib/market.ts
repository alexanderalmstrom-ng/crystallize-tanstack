import { env } from "@/env";

enum MarketCodeEnum {
  SE = "SE",
  NO = "NO",
  EU = "EU",
}

enum MarketCurrencyEnum {
  SEK = "SEK",
  NOK = "NOK",
  EUR = "EUR",
}

enum MarketLocaleEnum {
  SE = "sv-SE",
  NO = "nb-NO",
  EU = "en-US",
}

export type MarketConfig = (typeof marketConfig)[keyof typeof MarketCodeEnum];

export const marketConfig = {
  SE: {
    currency: MarketCurrencyEnum.SEK,
    locale: MarketLocaleEnum.SE,
  },
  NO: {
    currency: MarketCurrencyEnum.NOK,
    locale: MarketLocaleEnum.NO,
  },
  EU: {
    currency: MarketCurrencyEnum.EUR,
    locale: MarketLocaleEnum.EU,
  },
} as const;

export function getMarket(marketCode: MarketCode = env.VITE_MARKET_CODE) {
  return marketConfig[marketCode];
}

export type MarketCode = keyof typeof marketConfig;

export type MarketCurrency = keyof typeof MarketCurrencyEnum;

export type MarketLocale = keyof typeof MarketLocaleEnum;
