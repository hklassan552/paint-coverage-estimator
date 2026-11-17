import {
  M_PER_FT,
  M2_PER_FT2,
  STEP_FT,
  STEP_M,
  MAX_DIM_M,
  MIN_DIM_M,
} from '../constants/config';

export type LengthUnit = 'metres' | 'feet';

export const lengthSuffix = (unit: LengthUnit) => (unit === 'feet' ? 'ft' : 'm');
export const areaSuffix = (unit: LengthUnit) => (unit === 'feet' ? 'ft²' : 'm²');
export const coverageSuffix = (unit: LengthUnit) =>
  unit === 'feet' ? 'ft²/L' : 'm²/L';

/** Spoken forms for screen readers. */
export const spokenLength = (unit: LengthUnit) =>
  unit === 'feet' ? 'feet' : 'metres';
export const spokenArea = (unit: LengthUnit) =>
  unit === 'feet' ? 'square feet' : 'square metres';

export const metersToDisplay = (m: number, unit: LengthUnit) =>
  unit === 'feet' ? m / M_PER_FT : m;

export const displayToMeters = (v: number, unit: LengthUnit) =>
  unit === 'feet' ? v * M_PER_FT : v;

export const m2ToDisplay = (m2: number, unit: LengthUnit) =>
  unit === 'feet' ? m2 / M2_PER_FT2 : m2;

/** Canonical coverage is always stored as m²/L. */
export const coverageToDisplay = (m2PerL: number, unit: LengthUnit) =>
  unit === 'feet' ? m2PerL / M2_PER_FT2 : m2PerL;

export const coverageToCanonical = (value: number, unit: LengthUnit) =>
  unit === 'feet' ? value * M2_PER_FT2 : value;

export const dimensionStep = (unit: LengthUnit) =>
  unit === 'feet' ? STEP_FT : STEP_M;

export const maxDisplayDimension = (unit: LengthUnit) =>
  metersToDisplay(MAX_DIM_M, unit);

export const minDisplayDimension = (unit: LengthUnit) =>
  metersToDisplay(MIN_DIM_M, unit);

/**
 * Accepts a decimal comma or a decimal point, never both, and nothing else.
 * Returns null for anything this app must not silently reinterpret.
 */
export function parseDecimalInput(raw: string): number | null {
  const text = raw.trim();
  if (!text) {
    return null;
  }
  const hasComma = text.indexOf(',') >= 0;
  const hasDot = text.indexOf('.') >= 0;
  if (hasComma && hasDot) {
    return null;
  }
  const normalised = hasComma ? text.replace(',', '.') : text;
  if (!/^\d*\.?\d*$/.test(normalised) || normalised === '.') {
    return null;
  }
  const value = Number(normalised);
  if (!Number.isFinite(value)) {
    return null;
  }
  return value;
}

/** Round a display value to at most two decimals without drifting the sign. */
export const roundDisplay = (value: number) => Math.round(value * 100) / 100;
