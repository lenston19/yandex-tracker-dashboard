import { describe, it, expect, vi, afterEach } from 'vitest'
import { isWorkingDay } from '../../app/core/composables/use-production-calendar'

// ВНИМАНИЕ: monthCache — module-level Map, сохраняется между тестами.
// Каждый тест ОБЯЗАН использовать уникальный год+месяц чтобы не попасть в чужой кэш.
//
// Распределение месяцев по тестам:
//   API статусы : 2024-02 .. 2024-06  (февраль–июнь 2024)
//   Fallback    : 2024-07 .. 2024-09  (июль–сентябрь 2024)
//   Кэширование : 2025-01 .. 2025-03  (январь–март 2025)

function makeMonthData(day: number, status: string, totalDays = 31): string {
  const chars = Array(totalDays).fill('0')
  chars[day - 1] = status
  return chars.join('')
}

function mockFetch(responseText: string) {
  return vi.fn().mockResolvedValue({
    text: () => Promise.resolve(responseText)
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('isWorkingDay — API статусы', () => {
  it("статус '0' (рабочий) → true", async () => {
    vi.stubGlobal('fetch', mockFetch(makeMonthData(10, '0')))
    expect(await isWorkingDay(new Date('2024-02-10'))).toBe(true)
  })

  it("статус '1' (выходной/праздник) → false", async () => {
    vi.stubGlobal('fetch', mockFetch(makeMonthData(5, '1')))
    expect(await isWorkingDay(new Date('2024-03-05'))).toBe(false)
  })

  it("статус '2' (сокращённый рабочий) → true", async () => {
    vi.stubGlobal('fetch', mockFetch(makeMonthData(8, '2')))
    expect(await isWorkingDay(new Date('2024-04-08'))).toBe(true)
  })

  it("статус '4' (нет данных) → fallback к ISO: понедельник = true", async () => {
    vi.stubGlobal('fetch', mockFetch(makeMonthData(6, '4')))
    // 2024-05-06 — понедельник
    expect(await isWorkingDay(new Date('2024-05-06'))).toBe(true)
  })

  it("статус '4' (нет данных) → fallback к ISO: воскресенье = false", async () => {
    vi.stubGlobal('fetch', mockFetch(makeMonthData(2, '4')))
    // 2024-06-02 — воскресенье
    expect(await isWorkingDay(new Date('2024-06-02'))).toBe(false)
  })
})

describe('isWorkingDay — fallback при ошибке API', () => {
  it('fetch бросает ошибку → fallback: пятница = true', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    // 2024-07-05 — пятница
    expect(await isWorkingDay(new Date('2024-07-05'))).toBe(true)
  })

  it('fetch бросает ошибку → fallback: суббота = false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
    expect(await isWorkingDay(new Date('2024-08-03'))).toBe(false)
  })

  it('пустой ответ API → fallback к ISO: понедельник = true', async () => {
    vi.stubGlobal('fetch', mockFetch(''))
    expect(await isWorkingDay(new Date('2024-09-02'))).toBe(true)
  })
})

describe('isWorkingDay — кэширование', () => {
  it('два вызова с одним месяцем делают только один fetch', async () => {
    const fetchMock = mockFetch('0'.repeat(31))
    vi.stubGlobal('fetch', fetchMock)
    await isWorkingDay(new Date('2025-01-15'))
    await isWorkingDay(new Date('2025-01-20'))
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('вызовы с разными месяцами делают отдельные fetch', async () => {
    const fetchMock = mockFetch('0'.repeat(31))
    vi.stubGlobal('fetch', fetchMock)
    await isWorkingDay(new Date('2025-02-01'))
    await isWorkingDay(new Date('2025-03-01'))
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
