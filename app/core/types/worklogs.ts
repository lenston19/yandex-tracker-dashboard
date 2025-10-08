import type { Yandex } from './api/yandex-tracker/yandex-tracker.entity'

export interface CollectedWorklog {
  key: string
  items: Yandex.Worklog[]
}

export interface QueueWorklogs {
  queueName: string
  worklogs: CollectedWorklog[]
}

export type WorklogFormat = 'month' | 'week' | 'day'

export interface WorklogActionsProps {
  next?: () => Promise<void> | void
  prev?: () => Promise<void> | void
  refresh: () => Promise<Promise<void> | undefined>
  type?: WorklogFormat
  loading: boolean
}
