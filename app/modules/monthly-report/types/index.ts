import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

export interface IssueEstimationStat {
  issue: Yandex.Issue
  spentHours: number
  estimationHours: number
  overageHours: number
}

export interface TopIssueStat {
  issue: Yandex.Issue
  hours: number
}

export interface EstimationAccuracy {
  total: number
  withinEstimate: number
  percent: number
}
