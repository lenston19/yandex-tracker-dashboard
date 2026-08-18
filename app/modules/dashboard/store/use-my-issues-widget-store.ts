import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { useSiteSettingsStore } from '~/modules/settings'
import { buildFetchQuery, getIssuesOrderParam } from '~/core/utils/my-issues'
import { useWorklogBus } from '~/core/composables/use-worklog-bus'
import { useIssueBus } from '~/core/composables/use-issue-bus'
import { useIssueSpentHours } from '~/core/composables/use-issue-spent-hours'
import { MY_ISSUES_SORT_MODE, type MyIssuesSortMode } from '../models/constants/my-issues-sort'

const PAGE_SIZE = 5

export const useMyIssuesWidgetStore = defineStore('my-issues-widget', () => {
  const { login } = storeToRefs(useAuthStore())
  const { myIssues } = storeToRefs(useSiteSettingsStore())

  const issues = ref<Yandex.Issue[]>([])
  const page = ref(1)
  const totalCount = ref(0)
  const totalPages = ref(1)
  const sortMode = ref<MyIssuesSortMode>(MY_ISSUES_SORT_MODE.PRIORITY)
  const { issueSpentHoursMap, fetchSpentHours } = useIssueSpentHours(computed(() => myIssues.value.display.estimation))

  const { runWithLoading: refresh, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value) {
      issues.value = []
      totalCount.value = 0
      totalPages.value = 1
      issueSpentHoursMap.value = new Map()
      return
    }
    const statuses = myIssues.value.statuses.length ? myIssues.value.statuses : ['open', 'rediscovered']
    const baseQuery = buildFetchQuery(login.value, { statuses, priority: null, queue: '' }, myIssues.value.roles)
    const query = `${baseQuery} ${getIssuesOrderParam(sortMode.value)}`
    const response = await yandexTrackerApi.issueSearchRaw({ query }, PAGE_SIZE, String(page.value))

    const responseTotalCount = response.headers.get('X-Total-Count')
    const responseTotalPages = response.headers.get('X-Total-Pages')
    totalCount.value = responseTotalCount ? +responseTotalCount : 0
    totalPages.value = responseTotalPages ? +responseTotalPages : 1

    if (totalPages.value > 0 && page.value > totalPages.value) {
      page.value = totalPages.value
      return
    }

    issues.value = response._data ?? []
    await fetchSpentHours(issues.value)
  })

  watch(
    [login, () => myIssues.value.statuses, () => myIssues.value.roles, sortMode],
    async ([newLogin]) => {
      page.value = 1
      if (newLogin) {
        await refresh()
      }
    },
    { deep: true }
  )

  watch(page, () => refresh(), { immediate: true })

  useWorklogBus('saved', refresh)
  useIssueBus(({ key, status }) => {
    const index = issues.value.findIndex(i => i.key === key)
    if (index === -1) return
    const allowedStatuses = myIssues.value.statuses.length ? myIssues.value.statuses : ['open', 'rediscovered']
    if (!allowedStatuses.includes(status.key)) {
      issues.value.splice(index, 1)
    } else {
      issues.value[index]!.status = status
    }
  })

  return { issues, issueSpentHoursMap, isLoading, refresh, page, totalCount, totalPages, sortMode }
})
