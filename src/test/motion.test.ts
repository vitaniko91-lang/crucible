import { DUR, EASE, rise } from '../lib/motion'
test('duration tokens match house scale', () => {
  expect(DUR.fast).toBe(0.2); expect(DUR.normal).toBe(0.4)
  expect(DUR.slow).toBe(0.6); expect(DUR.dramatic).toBe(1.0)
})
test('ease is the house out-curve', () => {
  expect(EASE.out).toEqual([0.23, 1, 0.32, 1])
})
test('rise variant hidden→visible uses opacity+transform only', () => {
  expect(rise.hidden).toEqual({ opacity: 0, y: 16 })
  expect(rise.visible).toEqual({ opacity: 1, y: 0 })
})
