import type { PiniaPluginContext } from 'pinia'
import yandexTrackerApi from '../api/yandex-tracker.api'
import { calculateElapsedSeconds, buildWorklogPayload } from '../utils/time'
import { useTryCatchWithLoading } from '../composables/use-try-catch-with-loading'
import { worklogBus } from '../composables/use-worklog-events'

export const useTimerStore = defineStore(
  'timer',
  () => {
    const isRunning = ref(false)
    const issueKey = ref<string | null>(null)
    const issueSummary = ref<string | null>(null)
    const startedAt = ref<string | null>(null)

    const start = (key: string, summary: string) => {
      issueKey.value = key
      issueSummary.value = summary
      startedAt.value = new Date().toISOString()
      isRunning.value = true
    }

    const { runWithLoading: stop, isLoading: isSaving } = useTryCatchWithLoading(
      async (comment?: string, customSeconds?: number) => {
        if (!issueKey.value || !startedAt.value) throw new Error('Timer is not running')

        const seconds = customSeconds ?? calculateElapsedSeconds(startedAt.value)
        const payload = buildWorklogPayload(startedAt.value, seconds, comment)

        await yandexTrackerApi.worklogCreate(issueKey.value, payload)
        worklogBus.emit(undefined)
        reset()
      }
    )

    const reset = () => {
      isRunning.value = false
      issueKey.value = null
      issueSummary.value = null
      startedAt.value = null
    }

    return {
      isRunning,
      issueKey,
      issueSummary,
      startedAt,
      isSaving,
      start,
      stop,
      reset
    }
  },
  {
    persist: {
      afterHydrate: (ctx: PiniaPluginContext) => {
        if (ctx.store.startedAt) {
          const age = Date.now() - new Date(ctx.store.startedAt).getTime()
          const DAY_MS = 24 * 60 * 60 * 1000
          if (age > DAY_MS) ctx.store.reset()
        }
      }
    }
  }
)
