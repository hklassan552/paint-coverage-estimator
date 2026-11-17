import { LengthUnit, areaSuffix, lengthSuffix, m2ToDisplay, metersToDisplay } from './units';

const trimZeros = (text: string) => {
  if (text.indexOf('.') < 0) {
    return text;
  }
  return text.replace(/0+$/, '').replace(/\.$/, '');
};

/** Up to two decimals, trailing zeros dropped. */
export function num(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return trimZeros(value.toFixed(decimals));
}

/** Exactly two decimals, used where a stable column is wanted. */
export const fixed2 = (value: number) =>
  Number.isFinite(value) ? value.toFixed(2) : '—';

export function formatLength(meters: number, unit: LengthUnit): string {
  return `${num(metersToDisplay(meters, unit))} ${lengthSuffix(unit)}`;
}

export function formatArea(m2: number, unit: LengthUnit): string {
  return `${fixed2(m2ToDisplay(m2, unit))} ${areaSuffix(unit)}`;
}

/** Headline litres: rounded UP to two decimals so it never understates. */
export function ceil2(value: number): number {
  return Math.ceil(value * 100 - 1e-9) / 100;
}

export function formatLiters(liters: number, decimals = 2): string {
  return `${num(liters, decimals)} L`;
}

/** Purchased volume: one decimal, trailing .0 omitted. */
export function formatPurchased(liters: number): string {
  return `${num(liters, 1)} L`;
}

export function formatCanSize(size: number): string {
  return `${num(size, 1)} L`;
}

export function pluralCans(count: number): string {
  return count === 1 ? '1 can' : `${count} cans`;
}
