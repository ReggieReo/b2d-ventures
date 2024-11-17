export function getDayUntilDeadline(deadline: string) {
  const dayDeadline = new Date(deadline).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.floor((dayDeadline - today) / (1000 * 60 * 60 * 24));
}

export function calculateStockPrice(valuation: number, target_stock: number, allocation: number) {
  return valuation * (allocation / 100) / target_stock;
}
