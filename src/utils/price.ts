import { getMarket, type MarketCode } from "@/lib/market";

export function formatPrice(amount: number, marketCode?: MarketCode) {
  const market = getMarket(marketCode);

  return new Intl.NumberFormat(market.locale, {
    style: "currency",
    currency: market.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
