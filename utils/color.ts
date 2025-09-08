/**
 * Adjusts a hex color by a given amount.
 * @param {string} color - The hex color string (e.g., "#RRGGBB").
 * @param {number} amount - The amount to adjust by. Negative values darken, positive values lighten.
 * @returns {string} The adjusted hex color string.
 */
export function adjustColor(color: string, amount: number): string {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
