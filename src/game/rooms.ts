import {
  CAN_SIZES_L,
  DEFAULT_COATS,
  DEFAULT_COVERAGE_M2L,
  SEED_WALL_H_M,
  SEED_WALL_W_M,
} from '../constants/config';
import { ceil2 } from '../utils/format';
import { recommendCans } from './cans';
import { areaBreakdown, requiredLiters } from './estimate';
import { Opening, Room, RoomStatus, SavedResult, Wall } from './types';

let seq = 0;
export function newId(prefix: string): string {
  seq += 1;
  return prefix + '_' + Date.now().toString(36) + '_' + seq.toString(36);
}

export function makeWall(index: number, widthM = null, heightM = null): Wall {
  return {
    id: newId('wall'),
    label: 'Wall ' + index,
    widthM: widthM as number | null,
    heightM: heightM as number | null,
  };
}

export function relabelWalls(walls: Wall[]): Wall[] {
  return walls.map((w, i) => ({ ...w, label: 'Wall ' + (i + 1) }));
}

export function nextRoomName(rooms: Room[]): string {
  for (let i = 1; i < 999; i++) {
    const candidate = 'Room ' + i;
    if (!rooms.some(r => r.name === candidate)) {
      return candidate;
    }
  }
  return 'Room';
}

/**
 * A new estimate starts with one wall already carrying the common seed
 * dimensions, so the first step is editing real numbers rather than an
 * empty form. Walls added later start blank, as specified.
 */
export function createRoom(name: string): Room {
  const now = Date.now();
  const wall = makeWall(1);
  wall.widthM = SEED_WALL_W_M;
  wall.heightM = SEED_WALL_H_M;
  return {
    id: newId('room'),
    name,
    createdAt: now,
    updatedAt: now,
    calculationRevision: 1,
    walls: [wall],
    openings: [],
    ceiling: { enabled: false, lengthM: null, widthM: null },
    coats: DEFAULT_COATS,
    coverageM2PerLiter: DEFAULT_COVERAGE_M2L,
    availableCanSizesLiters: CAN_SIZES_L.slice(),
    linkedColorNoteId: null,
    savedResult: null,
  };
}

/** Only ever created by an explicit TRY EXAMPLE tap. */
export function createExampleRoom(): Room {
  const room = createRoom('Example room');
  const dims: Array<[number, number]> = [
    [4, 2.5],
    [3, 2.5],
    [4, 2.5],
    [3, 2.5],
  ];
  room.walls = dims.map((d, i) => {
    const w = makeWall(i + 1);
    w.widthM = d[0];
    w.heightM = d[1];
    return w;
  });
  const door: Opening = {
    id: newId('open'),
    wallId: room.walls[0].id,
    kind: 'door',
    widthM: 0.9,
    heightM: 2.1,
    quantity: 1,
  };
  const window: Opening = {
    id: newId('open'),
    wallId: room.walls[1].id,
    kind: 'window',
    widthM: 1.2,
    heightM: 1.2,
    quantity: 1,
  };
  room.openings = [door, window];
  room.ceiling = { enabled: true, lengthM: 4, widthM: 3 };
  return room;
}

export function duplicateRoom(room: Room, rooms: Room[]): Room {
  const wallIdMap = new Map<string, string>();
  const walls = room.walls.map(w => {
    const id = newId('wall');
    wallIdMap.set(w.id, id);
    return { ...w, id };
  });
  const openings = room.openings.map(o => ({
    ...o,
    id: newId('open'),
    wallId: wallIdMap.get(o.wallId) || o.wallId,
  }));
  let name = room.name + ' copy';
  let n = 2;
  while (rooms.some(r => r.name === name)) {
    name = room.name + ' copy ' + n;
    n += 1;
  }
  const now = Date.now();
  return {
    ...room,
    id: newId('room'),
    name,
    createdAt: now,
    updatedAt: now,
    calculationRevision: room.calculationRevision + 1,
    walls,
    openings,
    savedResult: room.savedResult
      ? { ...room.savedResult, inputRevision: -1 }
      : null,
  };
}

export function computeResult(room: Room): SavedResult | null {
  const area = areaBreakdown(room);
  if (!(area.paintableM2 > 0)) {
    return null;
  }
  const required = requiredLiters(
    area.paintableM2,
    room.coats,
    room.coverageM2PerLiter,
  );
  const plan = recommendCans(required, room.availableCanSizesLiters);
  if (!plan) {
    return null;
  }
  return {
    inputRevision: room.calculationRevision,
    calculatedAt: Date.now(),
    grossWallsM2: area.grossWallsM2,
    openingsM2: area.openingsM2,
    netWallsM2: area.netWallsM2,
    ceilingM2: area.ceilingM2,
    paintableM2: area.paintableM2,
    requiredLiters: required,
    purchasedLiters: plan.purchasedLiters,
    leftoverLiters: plan.leftoverLiters,
    coats: room.coats,
    coverageM2PerLiter: room.coverageM2PerLiter,
    rows: plan.rows,
  };
}

export function headlineLiters(result: SavedResult): number {
  return ceil2(result.requiredLiters);
}

export function roomStatus(room: Room): RoomStatus {
  if (!room.savedResult) {
    return 'draft';
  }
  return room.savedResult.inputRevision === room.calculationRevision
    ? 'estimated'
    : 'needs-update';
}

export const STATUS_LABEL: Record<RoomStatus, string> = {
  draft: 'Draft',
  estimated: 'Estimated',
  'needs-update': 'Needs update',
};
