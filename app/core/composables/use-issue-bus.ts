import { useEventBus } from '@vueuse/core'

export const useIssueBus = (callback?: () => void) => {
  const eventBus = useEventBus<string>('issue-updated')

  if (callback) {
    const unsubscribeBus = eventBus.on(fetch)
    onScopeDispose(() => unsubscribeBus())
  }

  return eventBus
}
