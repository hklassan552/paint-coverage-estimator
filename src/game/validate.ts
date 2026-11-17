import {
  MAX_COVERAGE_M2L,
  MAX_DIM_M,
  MAX_TOTAL_AREA_M2,
  MIN_COVERAGE_M2L,
  MIN_DIM_M,
} from '../constants/config';
import { areaBreakdown, openingsOnWallM2, wallGrossM2 } from './estimate';
import { Room } from './types';

export interface Issue {
  step: 'walls' | 'openings' | 'coats';
  fieldId: string;
  message: string;
}

const dimOk = (v: number | null): v is number =>
  v != null && Number.isFinite(v) && v >= MIN_DIM_M && v <= MAX_DIM_M;

export function validateWalls(room: Room): Issue[] {
  const issues: Issue[] = [];

  room.walls.forEach(wall => {
    if (wall.widthM == null) {
      issues.push({
        step: 'walls',
        fieldId: wall.id + '-width',
        message: wall.label + ' needs a width.',
      });
    } else if (!dimOk(wall.widthM)) {
      issues.push({
        step: 'walls',
        fieldId: wall.id + '-width',
        message: wall.label + ' width must be 0.01 to ' + MAX_DIM_M + ' m.',
      });
    }
    if (wall.heightM == null) {
      issues.push({
        step: 'walls',
        fieldId: wall.id + '-height',
        message: wall.label + ' needs a height.',
      });
    } else if (!dimOk(wall.heightM)) {
      issues.push({
        step: 'walls',
        fieldId: wall.id + '-height',
        message: wall.label + ' height must be 0.01 to ' + MAX_DIM_M + ' m.',
      });
    }
  });

  if (room.ceiling.enabled) {
    if (!dimOk(room.ceiling.lengthM)) {
      issues.push({
        step: 'walls',
        fieldId: 'ceiling-length',
        message: 'The included ceiling needs a valid length.',
      });
    }
    if (!dimOk(room.ceiling.widthM)) {
      issues.push({
        step: 'walls',
        fieldId: 'ceiling-width',
        message: 'The included ceiling needs a valid width.',
      });
    }
  }

  const area = areaBreakdown(room);
  if (issues.length === 0 && area.grossWallsM2 + area.ceilingM2 <= 0) {
    issues.push({
      step: 'walls',
      fieldId: 'surfaces',
      message: 'Add a paintable surface - a wall or the ceiling.',
    });
  }
  if (area.grossWallsM2 + area.ceilingM2 > MAX_TOTAL_AREA_M2) {
    issues.push({
      step: 'walls',
      fieldId: 'surfaces',
      message: 'Total surface may not exceed ' + MAX_TOTAL_AREA_M2 + ' m2.',
    });
  }
  return issues;
}

export function validateOpenings(room: Room): Issue[] {
  const issues: Issue[] = [];
  const wallById = new Map(room.walls.map(w => [w.id, w]));

  room.openings.forEach(opening => {
    const wall = wallById.get(opening.wallId);
    const kindLabel = opening.kind === 'door' ? 'Door' : 'Window';
    if (!wall) {
      issues.push({
        step: 'openings',
        fieldId: opening.id,
        message: kindLabel + ' is not attached to a wall.',
      });
      return;
    }
    if (opening.widthM == null || opening.heightM == null) {
      issues.push({
        step: 'openings',
        fieldId: opening.id,
        message: kindLabel + ' on ' + wall.label + ' needs a width and height.',
      });
      return;
    }
    if (wall.widthM != null && opening.widthM > wall.widthM + 1e-9) {
      issues.push({
        step: 'openings',
        fieldId: opening.id,
        message: kindLabel + ' is wider than ' + wall.label + '.',
      });
    }
    if (wall.heightM != null && opening.heightM > wall.heightM + 1e-9) {
      issues.push({
        step: 'openings',
        fieldId: opening.id,
        message: kindLabel + ' is taller than ' + wall.label + '.',
      });
    }
  });

  room.walls.forEach(wall => {
    const gross = wallGrossM2(wall);
    const deducted = openingsOnWallM2(wall.id, room.openings);
    if (gross > 0 && deducted > gross + 1e-9) {
      issues.push({
        step: 'openings',
        fieldId: wall.id,
        message:
          'Openings on ' + wall.label + ' add up to more than the wall itself.',
      });
    }
  });

  const area = areaBreakdown(room);
  if (issues.length === 0 && area.paintableM2 <= 0) {
    issues.push({
      step: 'openings',
      fieldId: 'paintable',
      message: 'Nothing is left to paint. Review the openings or the ceiling.',
    });
  }
  return issues;
}

export function validateCoats(room: Room): Issue[] {
  const issues: Issue[] = [];
  const c = room.coverageM2PerLiter;
  if (!Number.isFinite(c) || c < MIN_COVERAGE_M2L || c > MAX_COVERAGE_M2L) {
    issues.push({
      step: 'coats',
      fieldId: 'coverage',
      message:
        'Coverage must be ' +
        MIN_COVERAGE_M2L +
        ' to ' +
        MAX_COVERAGE_M2L +
        ' m2/L.',
    });
  }
  if (room.availableCanSizesLiters.length === 0) {
    issues.push({
      step: 'coats',
      fieldId: 'cans',
      message: 'Keep at least one can size selected.',
    });
  }
  return issues;
}

export function validateRoom(room: Room): Issue[] {
  return [
    ...validateWalls(room),
    ...validateOpenings(room),
    ...validateCoats(room),
  ];
}
