import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { calculateElapsedSeconds, buildWorklogPayload } from '../../app/core/utils/time'

describe('calculateElapsedSeconds', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('возвращает 0 если startedAt null', () => {
    expect(calculateElapsedSeconds(null)).toBe(0)
  })

  it('возвращает корректное кол-во секунд', () => {
    const start = new Date('2025-05-01T10:00:00.000Z').toISOString()
    vi.setSystemTime(new Date('2025-05-01T10:00:30.000Z'))
    expect(calculateElapsedSeconds(start)).toBe(30)
  })

  it('возвращает 3600 для 1 часа', () => {
    const start = new Date('2025-05-01T09:00:00.000Z').toISOString()
    vi.setSystemTime(new Date('2025-05-01T10:00:00.000Z'))
    expect(calculateElapsedSeconds(start)).toBe(3600)
  })

  it('не возвращает отрицательное значение (часы в будущем)', () => {
    const start = new Date('2025-05-01T11:00:00.000Z').toISOString()
    vi.setSystemTime(new Date('2025-05-01T10:00:00.000Z'))
    expect(calculateElapsedSeconds(start)).toBe(0)
  })
})

describe('buildWorklogPayload', () => {
  it('формирует корректный payload из startedAt и elapsedSeconds', () => {
    const startedAt = '2025-05-01T10:00:00.000Z'
    const payload = buildWorklogPayload(startedAt, 3600, 'тестовый комментарий')
    expect(payload.start).toBe(startedAt)
    expect(payload.duration).toBe('PT1H')
    expect(payload.comment).toBe('тестовый комментарий')
  })

  it('duration минимум PT1M при 0 секундах', () => {
    const startedAt = '2025-05-01T10:00:00.000Z'
    const payload = buildWorklogPayload(startedAt, 0)
    expect(payload.duration).toBe('PT1M')
  })

  it('comment опциональный — не добавляется если пустой', () => {
    const startedAt = '2025-05-01T10:00:00.000Z'
    const payload = buildWorklogPayload(startedAt, 60)
    expect(payload.comment).toBeUndefined()
  })

  it('1.5 часа → PT1H30M', () => {
    const startedAt = '2025-05-01T10:00:00.000Z'
    const payload = buildWorklogPayload(startedAt, 5400)
    expect(payload.duration).toBe('PT1H30M')
  })
})
