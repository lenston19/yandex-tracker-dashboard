import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { useSiteSettingsStore } from '~/modules/settings'
import { buildFetchQuery, sortByPriority } from '~/core/utils/my-issues'
import { useWorklogBus } from '~/core/composables/use-worklog-bus'
import { useIssueBus } from '~/core/composables/use-issue-bus'

export const useMyIssuesWidgetStore = defineStore('my-issues-widget', () => {
  const { login } = storeToRefs(useAuthStore())
  const { myIssues } = storeToRefs(useSiteSettingsStore())

  const issues = ref<Yandex.Issue[]>([])

  const { runWithLoading: refresh, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value) {
      issues.value = []
      return
    }
    const statuses = myIssues.value.statuses.length ? myIssues.value.statuses : ['open', 'rediscovered']
    const query = buildFetchQuery(login.value, { statuses, priority: null, queue: '' }, myIssues.value.roles)
    const data = await yandexTrackerApi.issueSearch({ query }, 50)
    issues.value = sortByPriority(data ?? [])
  })

  watch(
    [login, () => myIssues.value.statuses, () => myIssues.value.roles],
    async ([newLogin]) => {
      if (newLogin) {
        await refresh()
      }
    },
    { immediate: true, deep: true }
  )

  useWorklogBus('saved', refresh)
  useIssueBus(refresh)

  return { issues, isLoading, refresh }
})
