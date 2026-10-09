import { describe, expect, it } from 'vitest'
import { calcAccuracyByQueue } from '../../app/core/utils/monthly-insights'

describe('calcAccuracyByQueue', () => {
  it('пустой массив — пустой результат', () => {
    expect(calcAccuracyByQueue([])).toEqual([])
  })

  it('группирует по очереди и считает процент точности', () => {
    const items = [
      { queueKey: 'HZ', queueName: 'Horizon', isOverEstimated: false },
      { queueKey: 'HZ', queueName: 'Horizon', isOverEstimated: true },
      { queueKey: 'DEV', queueName: 'Dev', isOverEstimated: false }
    ]
    expect(calcAccuracyByQueue(items)).toEqual([
      { queueKey: 'HZ', queueName: 'Horizon', total: 2, percent: 50 },
      { queueKey: 'DEV', queueName: 'Dev', total: 1, percent: 100 }
    ])
  })

  it('сортирует по возрастанию точности (худшие первыми)', () => {
    const items = [
      { queueKey: 'A', queueName: 'A', isOverEstimated: false },
      { queueKey: 'B', queueName: 'B', isOverEstimated: true }
    ]
    expect(calcAccuracyByQueue(items).map(r => r.queueKey)).toEqual(['B', 'A'])
  })
})
