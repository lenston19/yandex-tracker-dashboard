import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

export interface Weekday {
  weekday: string
  monthDay: string
  hours: number
  items: Yandex.Worklog[]
}
