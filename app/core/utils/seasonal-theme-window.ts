import { addDays, subDays, startOfYear, differenceInCalendarDays } from 'date-fns'
import type { ThemeType } from '~/core/types'

const HALLOWEEN_LEAD_DAYS = 14
const NEW_YEAR_LEAD_DAYS = 21
const NEW_YEAR_TAIL_DAYS = 7
const PROGRAMMER_DAY_OF_YEAR = 256
const UPCOMING_GRACE_DAYS = 3

function atNoon(year: number, monthIndex: number, day: number): Date {
  return new Date(year, monthIndex, day, 12, 0, 0)
}

/** Сравнение по календарным дням, без учёта времени суток */
function isBetween(now: Date, start: Date, end: Date): boolean {
  return differenceInCalendarDays(now, start) >= 0 && differenceInCalendarDays(end, now) >= 0
}

/** Если дата попадает на выходной — расширяет окно до пятницы/понедельника вокруг неё */
function weekendWindow(date: Date): [Date, Date] {
  const day = date.getDay()
  if (day === 6) return [subDays(date, 1), addDays(date, 2)]
  if (day === 0) return [subDays(date, 2), addDays(date, 1)]
  return [date, date]
}

/** Возвращает дату праздника, актуальную для текущего "now" (без расширения на выходные) */
export function getHolidayDate(type: ThemeType, now: Date): Date {
  const year = now.getFullYear()
  switch (type) {
    case 'halloween':
      return atNoon(year, 9, 31)
    case '8-march':
      return atNoon(year, 2, 8)
    case 'programmer-day':
      return addDays(startOfYear(atNoon(year, 0, 1)), PROGRAMMER_DAY_OF_YEAR - 1)
    case 'new-year':
      return now.getMonth() === 0 ? atNoon(year, 0, 1) : atNoon(year + 1, 0, 1)
  }
}

/**
 * Дата праздника для отображения в виджете: если дата текущего года уже прошла больше чем на
 * UPCOMING_GRACE_DAYS (т.е. тема включена вручную далеко за пределами своего окна) — берём дату
 * следующего года, чтобы не показывать отсчёт/подпись к давно прошедшему событию.
 */
export function getUpcomingHolidayDate(type: ThemeType, now: Date): Date {
  if (type === 'new-year') return getHolidayDate(type, now)

  const date = getHolidayDate(type, now)
  if (differenceInCalendarDays(date, now) < -UPCOMING_GRACE_DAYS) {
    const nextYearNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate(), 12, 0, 0)
    return getHolidayDate(type, nextYearNow)
  }
  return date
}

/** Определяет, какая сезонная тема должна быть активна для переданной даты (по умолчанию — сейчас) */
export function getActiveSeasonalThemeType(now: Date = new Date()): ThemeType | undefined {
  const halloween = getHolidayDate('halloween', now)
  if (isBetween(now, subDays(halloween, HALLOWEEN_LEAD_DAYS), halloween)) return 'halloween'

  const year = now.getFullYear()
  for (const ny of [atNoon(year, 0, 1), atNoon(year + 1, 0, 1)]) {
    if (isBetween(now, subDays(ny, NEW_YEAR_LEAD_DAYS), addDays(ny, NEW_YEAR_TAIL_DAYS))) return 'new-year'
  }

  const [pdStart, pdEnd] = weekendWindow(getHolidayDate('programmer-day', now))
  if (isBetween(now, pdStart, pdEnd)) return 'programmer-day'

  const [m8Start, m8End] = weekendWindow(getHolidayDate('8-march', now))
  if (isBetween(now, m8Start, m8End)) return '8-march'

  return undefined
}
