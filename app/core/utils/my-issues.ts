import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'

export interface IssueFilters {
  statuses: string[]
  priority: string | null
  queue: string
}

export const buildFetchQuery = (login: string, filters: IssueFilters): string => {
  const parts = [`Assignee: ${login}`]
  if (filters.statuses.length) parts.push(`Status: ${filters.statuses.join(', ')}`)
  if (filters.priority) parts.push(`Priority: ${filters.priority}`)
  if (filters.queue) parts.push(`Queue: ${filters.queue}`)
  return parts.join(' ')
}

const PRIORITY_WEIGHT: Record<string, number> = {
  critical: 0,
  blocker: 0,
  major: 1,
  normal: 2,
  minor: 3,
  trivial: 4
}

export const getPriorityWeight = (issue: Yandex.Issue): number => {
  const key = issue.priority?.key?.toLowerCase() ?? ''
  const display = issue.priority?.display?.toLowerCase() ?? ''
  if (key in PRIORITY_WEIGHT) return PRIORITY_WEIGHT[key]!
  if (display.includes('критич') || display.includes('blocker')) return 0
  if (display.includes('высок') || display.includes('major')) return 1
  if (display.includes('средн') || display.includes('normal')) return 2
  return 3
}

export const sortByPriority = (issues: Yandex.Issue[]): Yandex.Issue[] =>
  [...issues].sort((a, b) => getPriorityWeight(a) - getPriorityWeight(b))

type BadgeColor = 'primary' | 'info' | 'success' | 'warning' | 'error' | 'secondary' | 'neutral'

export const getStatusColor = (status: Yandex.BaseWithKey): BadgeColor => {
  const key = (status.key ?? '').toLowerCase()
  const display = status.display.toLowerCase()
  if (key === 'inprogress' || display.includes('работ')) return 'primary'
  if (key === 'open' || display.includes('открыт')) return 'info'
  if (['closed', 'resolved'].includes(key) || display.includes('закрыт') || display.includes('решён')) return 'success'
  if (['rejected', 'cancelled', 'wontfix'].includes(key) || display.includes('отклон') || display.includes('отмен'))
    return 'error'
  if (['needinfo', 'reopened'].includes(key) || display.includes('нужна инф') || display.includes('переоткрыт'))
    return 'warning'
  if (['testing', 'review'].includes(key) || display.includes('тест') || display.includes('ревью')) return 'secondary'
  return 'neutral'
}

export const groupIssuesByQueue = (issues: Yandex.Issue[]): Record<string, Yandex.Issue[]> => {
  return issues.reduce<Record<string, Yandex.Issue[]>>((acc, issue) => {
    const key = issue.queue.display
    if (!acc[key]) acc[key] = []
    acc[key].push(issue)
    return acc
  }, {})
}
