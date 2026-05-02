import { describe, it, expect } from 'vitest'
import { buildFetchQuery, groupIssuesByQueue } from '../../app/core/utils/my-issues'
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
    expect(buildFetchQuery('user1', { statuses: ['open', 'reopened'], priority: null, queue: '' })).toBe(
      'Assignee: user1 Status: open, reopened'
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
    expect(buildFetchQuery('user', { statuses: ['open', 'reopened'], priority: 'high', queue: 'PROJ' })).toBe(
      'Assignee: user Status: open, reopened Priority: high Queue: PROJ'
    )
  })

  it('один статус', () => {
    expect(buildFetchQuery('u', { statuses: ['open'], priority: '', queue: '' })).toBe('Assignee: u Status: open')
  })
})

describe('groupIssuesByQueue', () => {
  it('группирует задачи по display имени очереди', () => {
    const issues = [
      makeIssue('A-1', 'A', 'Проект А'),
      makeIssue('A-2', 'A', 'Проект А'),
      makeIssue('B-1', 'B', 'Проект Б')
    ]
    const result = groupIssuesByQueue(issues)
    expect(Object.keys(result)).toEqual(['Проект А', 'Проект Б'])
    expect(result['Проект А']).toHaveLength(2)
    expect(result['Проект Б']).toHaveLength(1)
  })

  it('пустой массив → пустой объект', () => {
    expect(groupIssuesByQueue([])).toEqual({})
  })

  it('одна задача — одна группа', () => {
    const issues = [makeIssue('A-1', 'A', 'Проект А')]
    expect(groupIssuesByQueue(issues)).toEqual({ 'Проект А': [issues[0]] })
  })

  it('все задачи из одной очереди — один ключ', () => {
    const issues = [makeIssue('A-1', 'A', 'Общая'), makeIssue('A-2', 'A', 'Общая')]
    const result = groupIssuesByQueue(issues)
    expect(Object.keys(result)).toHaveLength(1)
    expect(result['Общая']).toHaveLength(2)
  })

  it('порядок групп соответствует первому появлению очереди', () => {
    const issues = [makeIssue('C-1', 'C', 'Ц'), makeIssue('A-1', 'A', 'А'), makeIssue('C-2', 'C', 'Ц')]
    expect(Object.keys(groupIssuesByQueue(issues))).toEqual(['Ц', 'А'])
  })
})
