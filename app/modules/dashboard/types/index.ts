import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

export interface Weekday {
  weekday: string
  monthDay: string
  shortDate: string
  dateKey: string
  isNewMonth: boolean
  hours: number
  isHoliday: boolean
  isToday: boolean
  items: Yandex.Worklog[]
}
