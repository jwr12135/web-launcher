export function isObject(item: unknown): boolean {
  return Boolean(item) && typeof item === 'object' && !Array.isArray(item);
}
