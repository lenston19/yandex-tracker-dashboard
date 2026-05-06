import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

export const LOCAL_UTC_ISO = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

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

/** Возвращает секунды, прошедшие с startedAt (ISO-строка). Минимум 0. */
export const calculateElapsedSeconds = (startedAt: string | null): number => {
  if (!startedAt) return 0
  return Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000))
}

/** Конвертирует количество секунд в ISO 8601 duration для API ворклога */
export const secondsToIsoDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  let result = 'PT'
  if (hours > 0) result += `${hours}H`
  if (minutes > 0) result += `${minutes}M`
  if (seconds > 0 && hours === 0) result += `${seconds}S`
  if (result === 'PT') result = 'PT1M'
  return result
}

/** Конвертирует ISO 8601 duration в строку русского формата "1н2д3ч4м5с" */
export const isoDurationToRu = (duration: string): string => {
  const m = duration.match(ISO_DURATION_RE)
  if (!m) return ''
  const parts = [
    m[1] && `${parseInt(m[1])}н`,
    m[2] && `${parseInt(m[2])}д`,
    m[3] && `${parseInt(m[3])}ч`,
    m[4] && `${parseInt(m[4])}м`,
    m[5] && `${parseInt(m[5])}с`
  ].filter(Boolean)
  return parts.join('')
}

/**
 * Парсит строку временной оценки в формате "1н2д3ч4м5с" в ISO 8601 duration.
 * Пример: "1д2ч30м" → "P1DT2H30M"
 */
export const parseRuDuration = (input: string): string => {
  const weeks = input.match(/(\d+)н/)?.[1]
  const days = input.match(/(\d+)д/)?.[1]
  const hours = input.match(/(\d+)ч/)?.[1]
  const minutes = input.match(/(\d+)м/)?.[1]
  const seconds = input.match(/(\d+)с/)?.[1]

  let result = 'P'
  if (weeks) result += `${weeks}W`
  if (days) result += `${days}D`
  const timePart = [hours && `${hours}H`, minutes && `${minutes}M`, seconds && `${seconds}S`].filter(Boolean).join('')
  if (timePart) result += `T${timePart}`

  return result.length > 1 ? result : 'PT1M'
}

/** Строит тело запроса создания ворклога из параметров таймера */
export const buildWorklogPayload = (
  startedAt: string,
  elapsedSeconds: number,
  comment?: string
): { start: string; duration: string; comment?: string } => {
  const payload: { start: string; duration: string; comment?: string } = {
    start: startedAt,
    duration: secondsToIsoDuration(elapsedSeconds)
  }
  if (comment && comment.trim()) {
    payload.comment = comment.trim()
  }
  return payload
}
