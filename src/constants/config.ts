import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/**
 * Splash duration. Exactly 8000 ms — shorter values race the screenshot
 * capture window of the UI test harness.
 */
export const LOADER_DURATION_MS = 8000;

export const HEADER_TOP_PAD = 44;
export const HEADER_BODY_H = 72;
export const TOUCH_MIN = 48;
export const PRIMARY_BTN_H = 56;
export const GUTTER = 16;
export const CARD_GAP = 12;

/** Board / preview geometry — parent padding + border are accounted for. */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 8;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
export const BOARD_INNER_W = BOARD_MAX_W - 2 * BOARD_FRAME;
export const PREVIEW_H = 120;

export const IS_SHORT_PHONE = SCREEN_H < 680;
export const IS_NARROW = SCREEN_W < 340;

/** Measurement limits (canonical metres). */
export const MIN_DIM_M = 0.01;
export const MAX_DIM_M = 30;
export const MAX_TOTAL_AREA_M2 = 1000;
export const MAX_WALLS = 20;
export const MAX_OPENINGS = 100;
export const MIN_QTY = 1;
export const MAX_QTY = 20;

/** Coats and coverage. */
export const MIN_COATS = 1;
export const MAX_COATS = 5;
export const DEFAULT_COATS = 2;
export const MIN_COVERAGE_M2L = 1;
export const MAX_COVERAGE_M2L = 30;
export const DEFAULT_COVERAGE_M2L = 10;
export const COVERAGE_STEP_M2L = 0.5;

/** Stepper increments. */
export const STEP_M = 0.1;
export const STEP_FT = 0.25;

/** Unit conversion constants (exact). */
export const M_PER_FT = 0.3048;
export const M2_PER_FT2 = 0.09290304;

/** Can sizes in litres, ascending. All selected by default. */
export const CAN_SIZES_L = [0.5, 1, 2.5, 5, 10] as const;
export const CAN_UNIT_L = 0.5;

/** Numerical-noise tolerance only — never a real allowance. */
export const VOLUME_EPSILON_L = 0.000000001;

/** Seed dimensions for the first wall of a freshly started estimate. */
export const SEED_WALL_W_M = 4;
export const SEED_WALL_H_M = 2.5;

/** Timings. */
export const AUTOSAVE_DEBOUNCE_MS = 400;
export const SAVED_MESSAGE_MS = 1600;
export const TRANSITION_MS = 180;
export const HAPTIC_MS = 10;

export const EDITOR_STEPS = ['walls', 'openings', 'coats', 'result'] as const;
export type EditorStep = (typeof EDITOR_STEPS)[number];

export const STEP_LABELS: Record<EditorStep, string> = {
  walls: 'Walls',
  openings: 'Openings',
  coats: 'Coats',
  result: 'Result',
};
