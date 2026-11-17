import { Ceiling, Opening, Room, Wall } from './types';

export interface AreaBreakdown {
  grossWallsM2: number;
  openingsM2: number;
  netWallsM2: number;
  ceilingM2: number;
  paintableM2: number;
}

export const wallGrossM2 = (wall: Wall): number =>
  wall.widthM != null && wall.heightM != null ? wall.widthM * wall.heightM : 0;

export const openingAreaM2 = (opening: Opening): number =>
  opening.widthM != null && opening.heightM != null
    ? opening.widthM * opening.heightM * opening.quantity
    : 0;

export const openingsOnWallM2 = (wallId: string, openings: Opening[]): number =>
  openings.reduce(
    (sum, o) => (o.wallId === wallId ? sum + openingAreaM2(o) : sum),
    0,
  );

/** A wall may be fully deducted, but never negative. */
export const wallNetM2 = (wall: Wall, openings: Opening[]): number =>
  Math.max(0, wallGrossM2(wall) - openingsOnWallM2(wall.id, openings));

export const ceilingAreaM2 = (ceiling: Ceiling): number =>
  ceiling.enabled && ceiling.lengthM != null && ceiling.widthM != null
    ? ceiling.lengthM * ceiling.widthM
    : 0;

export function areaBreakdown(room: Room): AreaBreakdown {
  const grossWallsM2 = room.walls.reduce((s, w) => s + wallGrossM2(w), 0);
  const openingsM2 = room.walls.reduce(
    (s, w) => s + Math.min(wallGrossM2(w), openingsOnWallM2(w.id, room.openings)),
    0,
  );
  const netWallsM2 = room.walls.reduce(
    (s, w) => s + wallNetM2(w, room.openings),
    0,
  );
  const ceilingM2 = ceilingAreaM2(room.ceiling);
  return {
    grossWallsM2,
    openingsM2,
    netWallsM2,
    ceilingM2,
    paintableM2: netWallsM2 + ceilingM2,
  };
}

/**
 * Coverage describes ONE coat. Area x coats / coverage — coats are never
 * applied anywhere else in the pipeline.
 */
export function requiredLiters(
  paintableM2: number,
  coats: number,
  coverageM2PerLiter: number,
): number {
  if (coverageM2PerLiter <= 0) {
    return 0;
  }
  return (paintableM2 * coats) / coverageM2PerLiter;
}
