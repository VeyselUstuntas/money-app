export function useAmountColorClass(amount: number) {
  if (amount > 0) return 'text-positive';
  else if(amount < 0) return 'text-negative';
  else return 'text-grey-6';
}
