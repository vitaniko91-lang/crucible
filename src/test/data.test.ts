import { graph, evalSuite, diffCase, flagged } from '../lib/data'
test('graph has typed nodes and edges that reference real node ids', () => {
  const ids = new Set(graph.nodes.map(n => n.id))
  expect(graph.nodes.length).toBe(6)
  graph.edges.forEach(e => { expect(ids.has(e.from)).toBe(true); expect(ids.has(e.to)).toBe(true) })
  expect(graph.nodes.find(n => n.selected)?.id).toBe('reason')
})
test('eval suite has 6 criteria with v1/v2 in 0..100', () => {
  expect(evalSuite.criteria.length).toBe(6)
  evalSuite.criteria.forEach(c => { expect(c.v1).toBeGreaterThanOrEqual(0); expect(c.v2).toBeLessThanOrEqual(100) })
  expect(evalSuite.cases).toBe(150)
  expect(evalSuite.flagged).toBe(8)
})
test('diff case is the refund-cap policy example', () => {
  expect(diffCase.criterion).toBe('Policy adherence')
  expect(diffCase.v1.passed).toBe(false)
  expect(diffCase.v2.passed).toBe(true)
})
test('flagged list length matches count minus "+more"', () => {
  expect(flagged.length).toBe(5)
})
