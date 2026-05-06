import { useEventBus } from '@vueuse/core'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'

export type IssueStatusUpdate = Pick<Yandex.Issue, 'key' | 'status'>

export const useIssueBus = (callback?: (update: IssueStatusUpdate) => void) => {
  const eventBus = useEventBus<IssueStatusUpdate>('issue-updated')

  if (callback) {
    const unsubscribeBus = eventBus.on(callback)
    onScopeDispose(() => unsubscribeBus())
  }

  return eventBus
}
