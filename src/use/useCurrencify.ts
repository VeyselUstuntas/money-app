export function useCurrencify(amount: number): string {
  // format: + $ 4,999.99 | - $ 199.00

  let posNegSymbol = "";

  if (amount > 0) posNegSymbol = "+";
  else if (amount < 0) posNegSymbol = "-";

  const currencySymbol = "$",
    amountPositive = Math.abs(amount),
    formattedAmount = amountPositive.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return `${posNegSymbol} ${currencySymbol} ${formattedAmount}`;
}
