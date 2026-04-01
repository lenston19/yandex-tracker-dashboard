import { formatInTimeZone } from 'date-fns-tz'
import { ru, type Locale } from 'date-fns/locale'
import { useNow } from '@vueuse/core'
import { useSiteSettingsStore, DEFAULT_TIME_ZONE, type TimeZoneSelectOption } from '~/modules/settings'

export const DATE_FORMATS = {
  SHORT_DATE: 'dd.MM.yyyy',
  TIME: 'HH:mm:ss',
  TIME_SHORT: 'HH:mm',
  MONTH_YEAR: 'LLLL yyyy',
  WEEKDAY: 'EEEE',
  FULL_DATE: 'dd MMMM yyyy',
  DAY: 'dd',
  DAY_MONTH: 'd MMM'
} as const

export function useDateFormatter() {
  const { timeZone } = storeToRefs(useSiteSettingsStore())
  const tz = computed(() => {
    const tzData = timeZone.value as TimeZoneSelectOption & { value?: string }
    // Legacy: id contains label like "(GMT+03:00) Moscow", real IANA id was in `value`
    if (tzData.id?.startsWith('(GMT') && tzData.value) return tzData.value
    return tzData.id ?? DEFAULT_TIME_ZONE.id
  })
  const now = useNow()

  const fmt = (date: Date | string | number, pattern: string, options?: { locale?: Locale }) => {
    if (date == null) return ''
    const d = date instanceof Date ? date : new Date(date)
    if (isNaN(d.getTime())) return ''
    return formatInTimeZone(d, tz.value, pattern, options)
  }

  const formatShortDate = (d: Date | string | number) => fmt(d, DATE_FORMATS.SHORT_DATE)
  const formatTime = (d: Date | string | number) => fmt(d, DATE_FORMATS.TIME)
  const formatDateToHHMM = (d: Date | string | number) => fmt(d, DATE_FORMATS.TIME_SHORT)
  const formatMonthYear = (d: Date | string | number) => fmt(d, DATE_FORMATS.MONTH_YEAR, { locale: ru })
  const formatWeekday = (d: Date | string | number) => fmt(d, DATE_FORMATS.WEEKDAY, { locale: ru })
  const formatFullDate = (d: Date | string | number) => fmt(d, DATE_FORMATS.FULL_DATE, { locale: ru })
  const formatDay = (d: Date | string | number) => fmt(d, DATE_FORMATS.DAY)
  const formatDayMonth = (d: Date | string | number) => fmt(d, DATE_FORMATS.DAY_MONTH, { locale: ru })
  const formatDayKey = (d: Date | string | number) => fmt(d, 'yyyy-MM-dd')
  const formatMonthShort = (d: Date | string | number) => fmt(d, 'LLL', { locale: ru })

  const isTodayInTz = (d: Date | string | number) => fmt(d, 'yyyy-MM-dd') === fmt(now.value, 'yyyy-MM-dd')

  const isSameDayInTz = (a: Date | string | number, b: Date | string | number) =>
    fmt(a, 'yyyy-MM-dd') === fmt(b, 'yyyy-MM-dd')

  return {
    tz,
    formatShortDate,
    formatTime,
    formatDateToHHMM,
    formatMonthYear,
    formatWeekday,
    formatFullDate,
    formatDay,
    formatDayMonth,
    formatDayKey,
    formatMonthShort,
    isTodayInTz,
    isSameDayInTz
  }
}
