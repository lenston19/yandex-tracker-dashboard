import { describe, it, expect } from 'vitest'
import { collectWorklogs, collectWorklogsByQueue } from '../../app/core/utils/collecting'
import type { Yandex } from '../../app/core/types/api/yandex-tracker/yandex-tracker.entity'

const makeWorklog = (id: string, issueKey: string | undefined, duration = 'PT1H'): Yandex.Worklog => ({
  self: '',
  id,
  version: '1',
  issue: issueKey ? { self: '', id, key: issueKey, display: issueKey } : (undefined as any),
  comment: '',
  createdBy: { self: '', id: '1', display: 'User' },
  updatedBy: { self: '', id: '1', display: 'User' },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  start: '2024-01-01T09:00:00Z',
  duration,
})

const makeQueue = (key: string, name: string): Yandex.Queue => ({
  self: '',
  id: key,
  key,
  version: 1,
  name,
  description: '',
  lead: { self: '', id: '1', display: 'Lead' },
  assignAuto: false,
  defaultType: { self: '', id: '1', key: 'task', display: 'Task' },
  defaultPriority: { self: '', id: '1', key: 'normal', display: 'Normal' },
  teamUsers: [],
  issueTypes: [],
  versions: [],
  workflows: [],
  denyVoting: false,
  issueTypesConfig: [],
})

describe('collectWorklogs', () => {
  it('группирует worklogs по ключу задачи', () => {
    const worklogs = [makeWorklog('1', 'TEST-1'), makeWorklog('2', 'TEST-1'), makeWorklog('3', 'TEST-2')]
    const { result } = collectWorklogs(worklogs)
    expect(result).toHaveLength(2)
    expect(result.find(r => r.key === 'TEST-1')?.items).toHaveLength(2)
    expect(result.find(r => r.key === 'TEST-2')?.items).toHaveLength(1)
  })

  it('пропускает worklogs без issueKey', () => {
    const worklogs = [makeWorklog('1', 'TEST-1'), makeWorklog('2', undefined)]
    const { result } = collectWorklogs(worklogs)
    expect(result).toHaveLength(1)
    expect(result[0]!.key).toBe('TEST-1')
  })

  it('возвращает пустой результат для пустого массива', () => {
    const { result } = collectWorklogs([])
    expect(result).toHaveLength(0)
  })

  it('возвращает groupedWorklogs как Map', () => {
    const worklogs = [makeWorklog('1', 'TEST-1')]
    const { groupedWorklogs } = collectWorklogs(worklogs)
    expect(groupedWorklogs.has('TEST-1')).toBe(true)
  })
})

describe('collectWorklogsByQueue', () => {
  it('группирует worklogs по очереди', () => {
    const queues = [makeQueue('TEST', 'Test Queue'), makeQueue('PROJ', 'Project Queue')]
    const worklogs = [makeWorklog('1', 'TEST-1'), makeWorklog('2', 'TEST-2'), makeWorklog('3', 'PROJ-1')]
    const result = collectWorklogsByQueue(queues, worklogs)
    expect(result).toHaveLength(2)
    expect(result.find(r => r.queueName === 'Test Queue')?.worklogs).toHaveLength(2)
    expect(result.find(r => r.queueName === 'Project Queue')?.worklogs).toHaveLength(1)
  })

  it('не включает очереди без worklogs', () => {
    const queues = [makeQueue('TEST', 'Test Queue'), makeQueue('EMPTY', 'Empty Queue')]
    const worklogs = [makeWorklog('1', 'TEST-1')]
    const result = collectWorklogsByQueue(queues, worklogs)
    expect(result).toHaveLength(1)
    expect(result[0]!.queueName).toBe('Test Queue')
  })

  it('сопоставление ключей не зависит от регистра', () => {
    const queues = [makeQueue('test', 'Test Queue')]
    const worklogs = [makeWorklog('1', 'TEST-1')]
    const result = collectWorklogsByQueue(queues, worklogs)
    expect(result).toHaveLength(1)
  })

  it('возвращает пустой массив если нет совпадений', () => {
    const queues = [makeQueue('OTHER', 'Other Queue')]
    const worklogs = [makeWorklog('1', 'TEST-1')]
    const result = collectWorklogsByQueue(queues, worklogs)
    expect(result).toHaveLength(0)
  })
})
