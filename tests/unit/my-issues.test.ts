import { describe, it, expect } from 'vitest'
import { buildFetchQuery, groupIssuesByQueue, sortByDeadline } from '../../app/core/utils/my-issues'
import type { Yandex } from '../../app/core/types/api/yandex-tracker/yandex-tracker.entity'

const makeIssue = (key: string, queueKey: string, queueDisplay: string): Yandex.Issue => ({
  self: '',
  id: key,
  key,
  version: 1,
  summary: `Summary ${key}`,
  status: { self: '', id: '1', key: 'open', display: 'Открыто' },
  priority: { self: '', id: '1', key: 'normal', display: 'Средний' },
  type: { self: '', id: '1', key: 'task', display: 'Задача' },
  queue: { self: '', id: '1', key: queueKey, display: queueDisplay },
  createdBy: { self: '', id: '1', display: 'User' },
  updatedBy: { self: '', id: '1', display: 'User' },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
})

describe('buildFetchQuery', () => {
  it('базовый запрос с логином и статусами', () => {
    expect(buildFetchQuery('user1', { statuses: ['open', 'rediscovered'], priority: null, queue: '' })).toBe(
      'Assignee: user1 Status: open, rediscovered'
    )
  })

  it('без статусов — не добавляет Status в запрос', () => {
    expect(buildFetchQuery('user1', { statuses: [], priority: null, queue: '' })).toBe('Assignee: user1')
  })

  it('с приоритетом', () => {
    expect(buildFetchQuery('u', { statuses: ['open'], priority: 'critical', queue: '' })).toBe(
      'Assignee: u Status: open Priority: critical'
    )
  })

  it('с очередью', () => {
    expect(buildFetchQuery('u', { statuses: [], priority: null, queue: 'MYQUEUE' })).toBe('Assignee: u Queue: MYQUEUE')
  })

  it('все фильтры одновременно', () => {
    expect(buildFetchQuery('user', { statuses: ['open', 'rediscovered'], priority: 'high', queue: 'PROJ' })).toBe(
      'Assignee: user Status: open, rediscovered Priority: high Queue: PROJ'
    )
  })

  it('один статус', () => {
    expect(buildFetchQuery('u', { statuses: ['open'], priority: '', queue: '' })).toBe('Assignee: u Status: open')
  })
})

describe('buildFetchQuery с roles', () => {
  const filters = { statuses: [], priority: null, queue: '' }

  it('только qaEngineer', () => {
    expect(buildFetchQuery('u', filters, { assignee: false, reviewer: false, qaEngineer: true })).toBe('"QA-Engineer": u')
  })

  it('все три роли', () => {
    expect(buildFetchQuery('u', filters, { assignee: true, reviewer: true, qaEngineer: true })).toBe(
      '(Assignee: u OR Reviewer: u OR "QA-Engineer": u)'
    )
  })

  it('assignee и qaEngineer', () => {
    expect(buildFetchQuery('u', filters, { assignee: true, reviewer: false, qaEngineer: true })).toBe(
      '(Assignee: u OR "QA-Engineer": u)'
    )
  })
})

describe('groupIssuesByQueue', () => {
  it('группирует задачи по ключу очереди', () => {
    const issues = [
      makeIssue('A-1', 'A', 'Проект А'),
      makeIssue('A-2', 'A', 'Проект А'),
      makeIssue('B-1', 'B', 'Проект Б')
    ]
    const result = groupIssuesByQueue(issues)
    expect(Object.keys(result)).toEqual(['A', 'B'])
    expect(result['A']).toHaveLength(2)
    expect(result['B']).toHaveLength(1)
  })

  it('пустой массив → пустой объект', () => {
    expect(groupIssuesByQueue([])).toEqual({})
  })

  it('одна задача — одна группа', () => {
    const issues = [makeIssue('A-1', 'A', 'Проект А')]
    expect(groupIssuesByQueue(issues)).toEqual({ A: [issues[0]] })
  })

  it('все задачи из одной очереди — один ключ', () => {
    const issues = [makeIssue('A-1', 'A', 'Общая'), makeIssue('A-2', 'A', 'Общая')]
    const result = groupIssuesByQueue(issues)
    expect(Object.keys(result)).toHaveLength(1)
    expect(result['A']).toHaveLength(2)
  })

  it('порядок групп соответствует первому появлению очереди', () => {
    const issues = [makeIssue('C-1', 'C', 'Ц'), makeIssue('A-1', 'A', 'А'), makeIssue('C-2', 'C', 'Ц')]
    expect(Object.keys(groupIssuesByQueue(issues))).toEqual(['C', 'A'])
  })
})

describe('sortByDeadline', () => {
  it('сортирует по возрастанию даты дедлайна', () => {
    const a = { ...makeIssue('A-1', 'A', 'А'), deadline: '2024-05-10' }
    const b = { ...makeIssue('A-2', 'A', 'А'), deadline: '2024-05-01' }
    const c = { ...makeIssue('A-3', 'A', 'А'), deadline: '2024-06-01' }
    expect(sortByDeadline([a, b, c]).map(i => i.key)).toEqual(['A-2', 'A-1', 'A-3'])
  })

  it('задачи без дедлайна уходят в конец', () => {
    const withDeadline = { ...makeIssue('A-1', 'A', 'А'), deadline: '2024-05-10' }
    const withoutDeadline = makeIssue('A-2', 'A', 'А')
    expect(sortByDeadline([withoutDeadline, withDeadline]).map(i => i.key)).toEqual(['A-1', 'A-2'])
  })

  it('пустой массив', () => {
    expect(sortByDeadline([])).toEqual([])
  })

  it('все задачи без дедлайна — порядок не меняется', () => {
    const issues = [makeIssue('A-1', 'A', 'А'), makeIssue('A-2', 'A', 'А')]
    expect(sortByDeadline(issues).map(i => i.key)).toEqual(['A-1', 'A-2'])
  })

  it('не мутирует исходный массив', () => {
    const a = { ...makeIssue('A-1', 'A', 'А'), deadline: '2024-05-10' }
    const b = { ...makeIssue('A-2', 'A', 'А'), deadline: '2024-05-01' }
    const issues = [a, b]
    sortByDeadline(issues)
    expect(issues.map(i => i.key)).toEqual(['A-1', 'A-2'])
  })
})
