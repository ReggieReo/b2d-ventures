export function getDayUntilDeadline(deadline: string) {
  const dayDeadline = new Date(deadline).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.floor((dayDeadline - today) / (1000 * 60 * 60 * 24));
}
