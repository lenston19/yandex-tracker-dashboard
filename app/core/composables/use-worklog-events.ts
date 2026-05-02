import { useEventBus } from '@vueuse/core'

export const worklogBus = useEventBus<undefined>('worklog-saved')
