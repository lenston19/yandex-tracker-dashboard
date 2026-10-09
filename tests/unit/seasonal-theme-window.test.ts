import { describe, it, expect } from 'vitest'
import {
  getActiveSeasonalThemeType,
  getHolidayDate,
  getUpcomingHolidayDate
} from '../../app/core/utils/seasonal-theme-window'

describe('getHolidayDate', () => {
  it('halloween — 31 октября текущего года', () => {
    expect(getHolidayDate('halloween', new Date(2026, 5, 1)).toDateString()).toBe(new Date(2026, 9, 31).toDateString())
  })

  it('8-march — 8 марта текущего года', () => {
    expect(getHolidayDate('8-march', new Date(2026, 5, 1)).toDateString()).toBe(new Date(2026, 2, 8).toDateString())
  })

  it('programmer-day — 13 сентября в обычный год', () => {
    expect(getHolidayDate('programmer-day', new Date(2026, 0, 1)).toDateString()).toBe(
      new Date(2026, 8, 13).toDateString()
    )
  })

  it('programmer-day — 12 сентября в високосный год', () => {
    expect(getHolidayDate('programmer-day', new Date(2028, 0, 1)).toDateString()).toBe(
      new Date(2028, 8, 12).toDateString()
    )
  })

  it('new-year — следующий НГ, если сейчас декабрь', () => {
    expect(getHolidayDate('new-year', new Date(2026, 11, 20)).toDateString()).toBe(new Date(2027, 0, 1).toDateString())
  })

  it('new-year — текущий НГ, если сейчас январь', () => {
    expect(getHolidayDate('new-year', new Date(2026, 0, 5)).toDateString()).toBe(new Date(2026, 0, 1).toDateString())
  })
})

describe('getActiveSeasonalThemeType', () => {
  it('до начала окна хэллоуина — тема не активна', () => {
    expect(getActiveSeasonalThemeType(new Date(2026, 9, 10))).toBeUndefined()
  })

  it('внутри окна хэллоуина (за 14 дней) — активна', () => {
    expect(getActiveSeasonalThemeType(new Date(2026, 9, 20))).toBe('halloween')
  })

  it('в день хэллоуина — активна', () => {
    expect(getActiveSeasonalThemeType(new Date(2026, 9, 31))).toBe('halloween')
  })

  it('после хэллоуина, до окна НГ — тема не активна', () => {
    expect(getActiveSeasonalThemeType(new Date(2026, 10, 10))).toBeUndefined()
  })

  it('заранее до НГ (декабрь) — активна', () => {
    expect(getActiveSeasonalThemeType(new Date(2026, 11, 15))).toBe('new-year')
  })

  it('после НГ, в хвосте окна (январь) — активна', () => {
    expect(getActiveSeasonalThemeType(new Date(2026, 0, 5))).toBe('new-year')
  })

  it('после хвоста НГ — тема не активна', () => {
    expect(getActiveSeasonalThemeType(new Date(2026, 0, 20))).toBeUndefined()
  })

  it('день программиста в будний день — активен только сам день', () => {
    const day = getHolidayDate('programmer-day', new Date(2029, 0, 1))
    expect(day.getDay()).not.toBe(0)
    expect(day.getDay()).not.toBe(6)
    expect(getActiveSeasonalThemeType(day)).toBe('programmer-day')
    expect(getActiveSeasonalThemeType(new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1))).not.toBe(
      'programmer-day'
    )
  })

  it('8 марта, выпавшее на выходной — окно расширяется на пятницу/понедельник', () => {
    // 2026-03-08 — воскресенье
    const sunday = new Date(2026, 2, 8)
    expect(sunday.getDay()).toBe(0)
    expect(getActiveSeasonalThemeType(new Date(2026, 2, 6))).toBe('8-march') // пятница
    expect(getActiveSeasonalThemeType(sunday)).toBe('8-march')
    expect(getActiveSeasonalThemeType(new Date(2026, 2, 9))).toBe('8-march') // понедельник
    expect(getActiveSeasonalThemeType(new Date(2026, 2, 5))).toBeUndefined() // четверг — рано
    expect(getActiveSeasonalThemeType(new Date(2026, 2, 10))).toBeUndefined() // вторник — поздно
  })
})

describe('getUpcomingHolidayDate', () => {
  it('8-march — дата текущего года, если праздник ещё впереди', () => {
    expect(getUpcomingHolidayDate('8-march', new Date(2026, 0, 1)).toDateString()).toBe(
      new Date(2026, 2, 8).toDateString()
    )
  })

  it('8-march — дата текущего года в пределах окна выходных (несколько дней после)', () => {
    // 2026-03-08 — воскресенье, значит "сегодня" понедельник 2026-03-09 всё ещё в окне
    expect(getUpcomingHolidayDate('8-march', new Date(2026, 2, 9)).toDateString()).toBe(
      new Date(2026, 2, 8).toDateString()
    )
  })

  it('8-march — перекатывается на следующий год, если принудительно включена далеко после даты', () => {
    expect(getUpcomingHolidayDate('8-march', new Date(2026, 9, 9)).toDateString()).toBe(
      new Date(2027, 2, 8).toDateString()
    )
  })

  it('halloween — перекатывается на следующий год, если сейчас уже декабрь', () => {
    expect(getUpcomingHolidayDate('halloween', new Date(2026, 11, 1)).toDateString()).toBe(
      new Date(2027, 9, 31).toDateString()
    )
  })

  it('new-year — не перекатывается, логика уже учитывает переход года', () => {
    expect(getUpcomingHolidayDate('new-year', new Date(2026, 9, 9)).toDateString()).toBe(
      new Date(2027, 0, 1).toDateString()
    )
  })
})
