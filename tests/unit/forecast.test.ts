import { describe, expect, it } from 'vitest'
import { calcForecastHours } from '../../app/core/utils/forecast'

describe('calcForecastHours', () => {
  it('возвращает null, если ещё не отработано ни одного дня', () => {
    expect(calcForecastHours(0, 0, 20)).toBeNull()
  })

  it('экстраполирует текущий темп на оставшиеся рабочие дни', () => {
    expect(calcForecastHours(24, 3, 17)).toBe(160)
  })

  it('прогноз равен текущим часам, если рабочих дней не осталось', () => {
    expect(calcForecastHours(150, 15, 0)).toBe(150)
  })

  it('округляет результат до одного знака после запятой', () => {
    expect(calcForecastHours(10, 3, 5)).toBeCloseTo(26.7, 1)
  })
})
