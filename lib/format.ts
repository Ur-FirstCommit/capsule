export function isFutureDate(value: string, now = Date.now()) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) && timestamp > now;
}
