export const MY_ISSUES_SORT_MODE = {
  PRIORITY: 'priority',
  DEADLINE: 'deadline'
} as const

export type MyIssuesSortMode = (typeof MY_ISSUES_SORT_MODE)[keyof typeof MY_ISSUES_SORT_MODE]

export const MY_ISSUES_SORT_OPTIONS: { value: MyIssuesSortMode; label: string }[] = [
  { value: MY_ISSUES_SORT_MODE.PRIORITY, label: 'По приоритету' },
  { value: MY_ISSUES_SORT_MODE.DEADLINE, label: 'По дедлайну' }
]
