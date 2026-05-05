import { useEventBus } from '@vueuse/core'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'

type WorklogBusPayload = {
  saved: Yandex.Worklog
  deleted: string
}

type WorklogBusEvent = {
  [K in keyof WorklogBusPayload]: { type: K; payload: WorklogBusPayload[K] }
}[keyof WorklogBusPayload]

export const useWorklogBus = <T extends keyof WorklogBusPayload>(
  type?: T,
  action?: (payload: WorklogBusPayload[T]) => void
) => {
  const eventBus = useEventBus<WorklogBusEvent>('worklog')

  if (type && action) {
    const unsubscribe = eventBus.on(event => {
      if (event.type === type) action(event.payload as WorklogBusPayload[T])
    })
    onScopeDispose(unsubscribe)
  }

  return {
    emit: <K extends keyof WorklogBusPayload>(eventType: K, payload: WorklogBusPayload[K]) => {
      eventBus.emit({ type: eventType, payload } as WorklogBusEvent)
    }
  }
}
