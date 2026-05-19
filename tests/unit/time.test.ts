import { describe, it, expect } from 'vitest'
import {
  calculateTotalHours,
  formatHoursToFixed,
  formatHoursToHHMMSS,
  calculateWorklogTimeByDay,
  secondsToIsoDuration,
  parseDateOnly
} from '../../app/core/utils/time'
import type { Yandex } from '../../app/core/types/api/yandex-tracker/yandex-tracker.entity'

const makeWorklog = (duration: string, id = '1'): Yandex.Worklog => ({
  self: '',
  id,
  version: '1',
  issue: { self: '', id: '1', key: 'TEST-1', display: 'Test' },
  comment: '',
  createdBy: { self: '', id: '1', display: 'User' },
  updatedBy: { self: '', id: '1', display: 'User' },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  start: '2024-01-01T09:00:00Z',
  duration
})

describe('calculateTotalHours', () => {
  it('суммирует часы из нескольких worklogs', () => {
    const worklogs = [makeWorklog('PT2H', '1'), makeWorklog('PT30M', '2')]
    expect(calculateTotalHours(worklogs)).toBeCloseTo(2.5)
  })

  it('возвращает 0 для пустого массива', () => {
    expect(calculateTotalHours([])).toBe(0)
  })

  it('суммирует смешанные форматы длительностей', () => {
    const worklogs = [makeWorklog('PT1H', '1'), makeWorklog('P1D', '2')]
    // 1 hour + 8 hours (1 рабочий день)
    expect(calculateTotalHours(worklogs)).toBeCloseTo(9)
  })

  it('PT0S → 0 часов', () => {
    expect(calculateTotalHours([makeWorklog('PT0S')])).toBeCloseTo(0)
  })

  it('один worklog', () => {
    expect(calculateTotalHours([makeWorklog('PT2H')])).toBeCloseTo(2)
  })
})

describe('formatHoursToHHMMSS', () => {
  it('0 часов → 00:00:00', () => {
    expect(formatHoursToHHMMSS(0)).toBe('00:00:00')
  })

  it('0.5 часа → 00:30:00', () => {
    expect(formatHoursToHHMMSS(0.5)).toBe('00:30:00')
  })

  it('8.75 часов → 08:45:00', () => {
    expect(formatHoursToHHMMSS(8.75)).toBe('08:45:00')
  })

  it('24 часа → 24:00:00', () => {
    expect(formatHoursToHHMMSS(24)).toBe('24:00:00')
  })

  it('168 часов → 168:00:00', () => {
    expect(formatHoursToHHMMSS(168)).toBe('168:00:00')
  })

  it('1 секунда (1/3600 ч) → 00:00:01', () => {
    expect(formatHoursToHHMMSS(1 / 3600)).toBe('00:00:01')
  })
})

describe('formatHoursToFixed', () => {
  it('округляет до 2 знаков после запятой', () => {
    expect(formatHoursToFixed(2.333)).toBe(2.33)
    expect(formatHoursToFixed(2.336)).toBe(2.34)
  })

  it('возвращает число (не строку)', () => {
    expect(typeof formatHoursToFixed(1.5)).toBe('number')
  })
})

describe('secondsToIsoDuration', () => {
  it('3600 секунд → "PT1H"', () => {
    expect(secondsToIsoDuration(3600)).toBe('PT1H')
  })

  it('90 секунд → "PT1M30S"', () => {
    expect(secondsToIsoDuration(90)).toBe('PT1M30S')
  })

  it('5400 секунд (1.5ч) → "PT1H30M"', () => {
    expect(secondsToIsoDuration(5400)).toBe('PT1H30M')
  })

  it('0 секунд → "PT1M" (минимум)', () => {
    expect(secondsToIsoDuration(0)).toBe('PT1M')
  })

  it('30 секунд → "PT30S"', () => {
    expect(secondsToIsoDuration(30)).toBe('PT30S')
  })
})

describe('parseDateOnly', () => {
  it('date-only строка — возвращает полдень того же дня', () => {
    const d = parseDateOnly('2026-05-19')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(4) // май = 4
    expect(d.getDate()).toBe(19)
    expect(d.getHours()).toBe(12)
    expect(d.getMinutes()).toBe(0)
  })

  it('полная ISO строка — берёт только дату, игнорирует время', () => {
    const d = parseDateOnly('2026-05-19T00:00:00.000Z')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(4)
    expect(d.getDate()).toBe(19)
    expect(d.getHours()).toBe(12)
  })

  it('LOCAL_UTC_ISO строка — берёт только дату', () => {
    const d = parseDateOnly('2026-01-01T23:59:59.999Z')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(0) // январь = 0
    expect(d.getDate()).toBe(1)
    expect(d.getHours()).toBe(12)
  })

  it('возвращает валидный Date объект', () => {
    const d = parseDateOnly('2026-05-19')
    expect(d).toBeInstanceOf(Date)
    expect(isNaN(d.getTime())).toBe(false)
  })
})

describe('calculateWorklogTimeByDay (через calculateDurationInHours)', () => {
  it('PT8H → 08:00:00', () => {
    expect(calculateWorklogTimeByDay(makeWorklog('PT8H'))).toBe('08:00:00')
  })

  it('PT30M → 00:30:00', () => {
    expect(calculateWorklogTimeByDay(makeWorklog('PT30M'))).toBe('00:30:00')
  })

  it('PT45S → 00:00:45', () => {
    expect(calculateWorklogTimeByDay(makeWorklog('PT45S'))).toBe('00:00:45')
  })

  it('P1D → 08:00:00 (1 рабочий день = 8 ч)', () => {
    expect(calculateWorklogTimeByDay(makeWorklog('P1D'))).toBe('08:00:00')
  })

  it('P1W → 40:00:00 (1 рабочая неделя = 40 ч)', () => {
    expect(calculateWorklogTimeByDay(makeWorklog('P1W'))).toBe('40:00:00')
  })

  it('P1W2DT3H → 40 + 16 + 3 = 59:00:00', () => {
    expect(calculateWorklogTimeByDay(makeWorklog('P1W2DT3H'))).toBe('59:00:00')
  })

  it('пустая строка → 00:00:00', () => {
    expect(calculateWorklogTimeByDay(makeWorklog(''))).toBe('00:00:00')
  })

  it('PT1H30M → 01:30:00', () => {
    expect(calculateWorklogTimeByDay(makeWorklog('PT1H30M'))).toBe('01:30:00')
  })
})
