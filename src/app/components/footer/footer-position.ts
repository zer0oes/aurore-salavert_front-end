export function privacyRevealOffset(scrollTop: number, viewportBottom: number, privacyTop: number, privacyHeight: number, bottomMargin: number): number {
  if (scrollTop <= 0 || privacyHeight <= 0) return 0;
  return Math.max(0, Math.min(privacyHeight + bottomMargin, viewportBottom - privacyTop));
}
