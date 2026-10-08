import type { UiColors } from '~/core/types'

export function getHoursProgressColor(hours: number, max: number, isHoliday = false): UiColors {
  if (isHoliday) return hours ? 'info' : 'neutral'
  if (hours) {
    if (hours < 2) return 'error'
    if (hours < max) return 'warning'
  }
  return 'success'
}
