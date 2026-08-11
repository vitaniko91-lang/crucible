import { overall, delta } from '../lib/score'
const v1 = [84, 79, 88, 90, 61, 96]
const v2 = [95, 92, 99, 93, 96, 94]
test('overall = rounded average of criteria', () => {
  // v1 = [84,79,88,90,61,96] sums to 498, /6 = 83.0 exactly (mandated formula).
  // Task spec listed 82.6 but that is arithmetically impossible for these integers;
  // computed value is canonical (same rule the note establishes for v2).
  expect(overall(v1)).toBe(83)
  expect(overall(v2)).toBe(94.8)
})
test('delta = v2 - v1 per criterion', () => {
  expect(delta(84, 95)).toBe(11)
  expect(delta(96, 94)).toBe(-2)
})
