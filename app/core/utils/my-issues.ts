import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'

export interface IssueFilters {
  statuses: string[]
  priority: string | null
  queue: string
}

export interface IssueRoles {
  assignee: boolean
  reviewer: boolean
  qaEngineer: boolean
}

const ROLE_FIELD: Record<keyof IssueRoles, string> = {
  assignee: 'Assignee',
  reviewer: 'Reviewer',
  qaEngineer: 'QA-Engineer'
}

export const buildFetchQuery = (login: string, filters: IssueFilters, roles?: IssueRoles): string => {
  const activeRoles = roles
    ? (Object.keys(roles) as (keyof IssueRoles)[]).filter(k => roles[k])
    : (['assignee'] as (keyof IssueRoles)[])

  const roleParts = activeRoles.map(r => {
    const field = ROLE_FIELD[r]
    const quotedField = field.includes('-') ? `"${field}"` : field
    return `${quotedField}: ${login}`
  })
  const roleClause = roleParts.length > 1 ? `(${roleParts.join(' OR ')})` : (roleParts[0] ?? `Assignee: ${login}`)

  const parts = [roleClause]
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
  if (['needinfo', 'rediscovered'].includes(key) || display.includes('нужна инф') || display.includes('переоткрыт'))
    return 'warning'
  if (['testing', 'review'].includes(key) || display.includes('тест') || display.includes('ревью')) return 'secondary'
  return 'neutral'
}

export const groupIssuesByQueue = (issues: Yandex.Issue[]): Record<string, Yandex.Issue[]> => {
  return issues.reduce<Record<string, Yandex.Issue[]>>((acc, issue) => {
    const key = issue.queue.key
    if (!acc[key]) acc[key] = []
    acc[key].push(issue)
    return acc
  }, {})
}

export const QUEUE_PREVIEW_SIZE = 5

const STATUS_SORT_ORDER: Record<string, number> = {
  inProgress: 0,
  review: 1,
  testing: 2,
  rediscovered: 3,
  open: 4,
  needInfo: 5
}

export const sortByStatusPriority = (issues: Yandex.Issue[]): Yandex.Issue[] =>
  [...issues].sort((a, b) => {
    const wa = STATUS_SORT_ORDER[a.status.key] ?? 99
    const wb = STATUS_SORT_ORDER[b.status.key] ?? 99
    return wa - wb
  })
