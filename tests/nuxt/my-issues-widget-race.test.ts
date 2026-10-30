import { describe, it, expect, vi, beforeEach } from 'vitest'
import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import { useMyIssuesWidgetStore } from '../../app/modules/dashboard/store/use-my-issues-widget-store'
import { useAuthStore } from '../../app/core/store/use-auth-store'
import { useIssueBus } from '../../app/core/composables/use-issue-bus'

vi.mock('~/core/api/yandex-tracker.api', () => ({
  default: {
    issueSearchRaw: vi.fn(),
    worklogListByIssue: vi.fn().mockResolvedValue([])
  }
}))

const makeIssue = (key: string) =>
  ({
    key,
    status: { key: 'open', display: 'Открыт' }
  }) as any

const rawResponse = (issues: any[]) => ({
  headers: new Headers({ 'X-Total-Count': String(issues.length), 'X-Total-Pages': '1' }),
  _data: issues
})

describe('use-my-issues-widget-store: гонка рефетча и смены статуса', () => {
  beforeEach(() => {
    vi.mocked(yandexTrackerApi.issueSearchRaw).mockReset()
    useAuthStore().mySelf = { login: 'tester', display: 'Tester' } as any
  })

  it('не возвращает задачу, если устаревший рефетч резолвится после удаления по issue-bus', async () => {
    const store = useMyIssuesWidgetStore()

    vi.mocked(yandexTrackerApi.issueSearchRaw).mockResolvedValueOnce(rawResponse([makeIssue('BO-1')]) as any)
    await store.refresh()
    expect(store.issues.map(i => i.key)).toEqual(['BO-1'])

    useIssueBus().emit({ key: 'BO-1', status: { key: 'closed', display: 'Закрыта' } as any })
    expect(store.issues).toHaveLength(0)

    vi.mocked(yandexTrackerApi.issueSearchRaw).mockResolvedValueOnce(rawResponse([makeIssue('BO-1')]) as any)
    await store.refresh()

    expect(store.issues).toHaveLength(0)
  })
})
