import { LengthUnit } from '../utils/units';

export type Blank = null;

export interface Wall {
  id: string;
  label: string;
  widthM: number | Blank;
  heightM: number | Blank;
  copiedHeight?: boolean;
}

export type OpeningKind = 'door' | 'window';

export interface Opening {
  id: string;
  wallId: string;
  kind: OpeningKind;
  widthM: number | Blank;
  heightM: number | Blank;
  quantity: number;
}

export interface Ceiling {
  enabled: boolean;
  lengthM: number | Blank;
  widthM: number | Blank;
}

export interface CanRow {
  sizeL: number;
  count: number;
}

export interface SavedResult {
  inputRevision: number;
  calculatedAt: number;
  grossWallsM2: number;
  openingsM2: number;
  netWallsM2: number;
  ceilingM2: number;
  paintableM2: number;
  requiredLiters: number;
  purchasedLiters: number;
  leftoverLiters: number;
  coats: number;
  coverageM2PerLiter: number;
  rows: CanRow[];
}

export interface Room {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  calculationRevision: number;
  walls: Wall[];
  openings: Opening[];
  ceiling: Ceiling;
  coats: number;
  coverageM2PerLiter: number;
  availableCanSizesLiters: number[];
  linkedColorNoteId?: string | null;
  savedResult?: SavedResult | null;
}

export interface ColorNote {
  id: string;
  name: string;
  colorCode: string;
  brand?: string;
  note?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  lengthUnit: LengthUnit;
  hapticsEnabled: boolean;
  reduceMotionEnabled: boolean;
}

export type RoomStatus = 'draft' | 'estimated' | 'needs-update';
