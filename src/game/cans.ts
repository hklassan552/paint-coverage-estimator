import { CAN_UNIT_L, VOLUME_EPSILON_L } from '../constants/config';
import { CanRow } from './types';

export interface CanPlan {
  rows: CanRow[]; // descending by can size, zero counts removed
  purchasedLiters: number;
  leftoverLiters: number;
}

/**
 * Deterministic bounded dynamic programme in 0.5 L integer units.
 *
 * Optimisation order:
 *   1. lowest purchased total that still covers the unrounded requirement
 *   2. fewest cans for that total
 *   3. tie-break: more 10 L, then more 5 L, then 2.5 L, then 1 L, then 0.5 L
 *
 * Greedy rounding is not sufficient once sizes are deselected, which is why
 * the search is exhaustive over the bounded range.
 */
export function recommendCans(
  requiredL: number,
  availableSizesL: number[],
): CanPlan | null {
  const sizes = availableSizesL
    .filter(s => s > 0)
    .slice()
    .sort((a, b) => b - a); // descending — matches the tie-break order

  if (sizes.length === 0 || !(requiredL > 0) || !Number.isFinite(requiredL)) {
    return null;
  }

  const sizeUnits = sizes.map(s => Math.round(s / CAN_UNIT_L));
  const target = Math.ceil(
    requiredL / CAN_UNIT_L - VOLUME_EPSILON_L / CAN_UNIT_L,
  );
  if (target <= 0) {
    return null;
  }

  let largest = sizeUnits[0];
  for (let i = 1; i < sizeUnits.length; i++) {
    if (sizeUnits[i] > largest) {
      largest = sizeUnits[i];
    }
  }
  const maxUnits = target + largest - 1;

  // counts[t] holds the retained combination for total t, aligned with sizes.
  const counts: (Int32Array | null)[] = new Array(maxUnits + 1).fill(null);
  const totalCans = new Int32Array(maxUnits + 1);
  counts[0] = new Int32Array(sizes.length);

  const betterThan = (a: Int32Array, b: Int32Array): boolean => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return a[i] > b[i]; // more of the larger size wins
      }
    }
    return false;
  };

  for (let t = 1; t <= maxUnits; t++) {
    let best: Int32Array | null = null;
    let bestCans = 0;
    for (let i = 0; i < sizeUnits.length; i++) {
      const prev = t - sizeUnits[i];
      if (prev < 0) {
        continue;
      }
      const prevCounts = counts[prev];
      if (!prevCounts) {
        continue;
      }
      const candidate = Int32Array.from(prevCounts);
      candidate[i] += 1;
      const candidateCans = totalCans[prev] + 1;
      if (
        best === null ||
        candidateCans < bestCans ||
        (candidateCans === bestCans && betterThan(candidate, best))
      ) {
        best = candidate;
        bestCans = candidateCans;
      }
    }
    if (best) {
      counts[t] = best;
      totalCans[t] = bestCans;
    }
  }

  for (let t = target; t <= maxUnits; t++) {
    const found = counts[t];
    if (!found) {
      continue;
    }
    const rows: CanRow[] = [];
    for (let i = 0; i < sizes.length; i++) {
      if (found[i] > 0) {
        rows.push({ sizeL: sizes[i], count: found[i] });
      }
    }
    const purchasedLiters = t * CAN_UNIT_L;
    return {
      rows,
      purchasedLiters,
      leftoverLiters: Math.max(0, purchasedLiters - requiredL),
    };
  }

  return null;
}
