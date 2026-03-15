import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

const ISO_DURATION_RE =
  /P(?:(\d+(?:[.,]\d+)?)W)?(?:(\d+(?:[.,]\d+)?)D)?(?:T(?:(\d+(?:[.,]\d+)?)H)?(?:(\d+(?:[.,]\d+)?)M)?(?:(\d+(?:[.,]\d+)?)S)?)?/

const calculateDurationInHours = (duration: string): number => {
  const m = duration.match(ISO_DURATION_RE)
  if (!m) return 0
  const weeks = parseFloat(m[1] || '0')
  const days = parseFloat(m[2] || '0')
  const hours = parseFloat(m[3] || '0')
  const minutes = parseFloat(m[4] || '0')
  const seconds = parseFloat(m[5] || '0')
  return weeks * 40 + days * 8 + hours + minutes / 60 + seconds / 3600
}

export const calculateTotalHours = (worklogs: Yandex.Worklog[]): number => {
  return worklogs.reduce((total, worklog) => total + calculateDurationInHours(worklog.duration), 0)
}

export const formatHoursToFixed = (hours: number): number => {
  return +hours.toFixed(2)
}

export const formatHoursToHHMMSS = (hours: number): string => {
  const totalSeconds = Math.round(hours * 3600)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const calculateWorklogTimeByDay = (worklog: Yandex.Worklog): string => {
  return formatHoursToHHMMSS(calculateDurationInHours(worklog.duration))
}
