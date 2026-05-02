import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { useSiteSettingsStore } from '~/modules/settings'
import { sortByPriority } from '~/core/utils/my-issues'
import { worklogBus } from '~/core/composables/use-worklog-events'

export const useMyIssuesWidgetStore = defineStore('my-issues-widget', () => {
  const { login } = storeToRefs(useAuthStore())
  const { myIssues } = storeToRefs(useSiteSettingsStore())

  const issues = ref<Yandex.Issue[]>([])

  const { runWithLoading: refresh, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value) {
      issues.value = []
      return
    }
    const statuses = myIssues.value.statuses.join(', ') || 'open, reopened'
    const data = await yandexTrackerApi.issueSearch({ query: `Assignee: ${login.value} Status: ${statuses}` }, 50)
    issues.value = sortByPriority(data ?? [])
  })

  watch(
    [login, () => myIssues.value.statuses],
    async ([newLogin]) => {
      if (newLogin) {
        await refresh()
      }
    },
    { immediate: true, deep: true }
  )

  const unsubscribeWorklogBus = worklogBus.on(() => refresh())
  onScopeDispose(() => unsubscribeWorklogBus())

  return { issues, isLoading, refresh }
})
