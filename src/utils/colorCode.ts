/**
 * Codes are preserved exactly as entered (after trimming). A colour preview is
 * only shown for an explicit #RRGGBB value — a proprietary code never has a
 * colour guessed for it.
 */
export function previewHex(code: string): string | null {
  const text = code.trim();
  return /^#[0-9a-fA-F]{6}$/.test(text) ? text.toUpperCase() : null;
}

export function trimCode(code: string): string {
  return code.trim();
}
