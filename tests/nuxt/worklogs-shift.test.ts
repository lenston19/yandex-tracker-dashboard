import { describe, it, expect } from 'vitest'
import { shiftPeriod } from '../../app/core/store/use-worklogs-store'

describe('shiftPeriod', () => {
  // 2024-01-10 — среда
  const wednesday = '2024-01-10T00:00:00.000Z'

  describe('day формат', () => {
    it('сдвиг на +1 день', () => {
      const { from, to } = shiftPeriod(wednesday, 'day', 1)
      expect(from).toContain('2024-01-11')
      expect(to).toContain('2024-01-11')
    })

    it('сдвиг на -1 день', () => {
      const { from, to } = shiftPeriod(wednesday, 'day', -1)
      expect(from).toContain('2024-01-09')
      expect(to).toContain('2024-01-09')
    })

    it('сдвиг на 0 — тот же день', () => {
      const { from, to } = shiftPeriod(wednesday, 'day', 0)
      expect(from).toContain('2024-01-10')
      expect(to).toContain('2024-01-10')
    })
  })

  describe('week формат', () => {
    it('сдвиг на +1 неделю', () => {
      const { from } = shiftPeriod(wednesday, 'week', 1)
      expect(from).toContain('2024-01-15') // пн следующей недели
    })

    it('сдвиг на -1 неделю', () => {
      const { from } = shiftPeriod(wednesday, 'week', -1)
      expect(from).toContain('2024-01-01') // пн предыдущей недели
    })

    it('начало недели — понедельник', () => {
      const { from } = shiftPeriod(wednesday, 'week', 0)
      expect(from).toContain('2024-01-08') // пн той же недели
    })

    it('конец недели — воскресенье', () => {
      const { to } = shiftPeriod(wednesday, 'week', 0)
      expect(to).toContain('2024-01-14') // вс той же недели
    })
  })

  describe('month формат', () => {
    it('сдвиг на +1 месяц', () => {
      const { from } = shiftPeriod(wednesday, 'month', 1)
      expect(from).toContain('2024-02-01')
    })

    it('сдвиг на -1 месяц', () => {
      const { from } = shiftPeriod(wednesday, 'month', -1)
      expect(from).toContain('2023-12-01')
    })

    it('начало месяца — первое число', () => {
      const { from } = shiftPeriod(wednesday, 'month', 0)
      expect(from).toContain('2024-01-01')
    })

    it('конец месяца — последнее число', () => {
      const { to } = shiftPeriod(wednesday, 'month', 0)
      expect(to).toContain('2024-01-31')
    })
  })

  describe('граничные случаи', () => {
    it('конец января + 1 месяц → начало/конец февраля (високосный год)', () => {
      const jan31 = '2024-01-31T00:00:00.000Z'
      const { from, to } = shiftPeriod(jan31, 'month', 1)
      expect(from).toContain('2024-02-01')
      expect(to).toContain('2024-02-29') // 2024 — високосный год
    })
  })
})
