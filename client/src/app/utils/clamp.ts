export default function clamp(
  number: number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY,
  step = 0,
): number {
  if (step) number = Math.round(number / step) * step;

  return Math.max(min, Math.min(number, max));
}
