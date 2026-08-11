export const overall = (scores: number[]): number =>
  Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
export const delta = (a: number, b: number): number => b - a
