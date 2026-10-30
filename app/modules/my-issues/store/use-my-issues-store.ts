import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { buildFetchQuery, groupIssuesByQueue, sortByStatusPriority, QUEUE_PREVIEW_SIZE } from '~/core/utils/my-issues'
import type { IssueFilters } from '~/core/utils/my-issues'
import { DEFAULT_ISSUE_STATUSES } from '~/core/constants/issues'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useIssueBus } from '~/core/composables/use-issue-bus'
import { useIssueSpentHours } from '~/core/composables/use-issue-spent-hours'
import { useQueuesStore } from '~/core/store/use-queues-store'
import { retryOn429 } from '~/core/utils/fetch-all-pages'

// ponytail: один запрос на все выбранные очереди (Queue: Q1, Q2, ...) вместо запроса на каждую —
// при очень большом суммарном числе совпадений (много очередей + статус "Решён") превью/счётчик
// отдельной очереди может быть урезан откликом Tracker, но без риска 429. Поднять, если пожалуются.
const COMBINED_PAGE_SIZE = 200
const RATE_LIMIT_RETRIES = 2

type QueueState = {
  issues: Yandex.Issue[]
  totalCount: number
}

export const useMyIssuesStore = defineStore('my-issues-page', () => {
  const { login } = storeToRefs(useAuthStore())
  const { myIssues } = storeToRefs(useSiteSettingsStore())
  const route = useRoute()
  const router = useRouter()
  const { queuesModel } = storeToRefs(useQueuesStore())

  const selectedQueues = ref<string[]>(parseQueues())
  const queueStates = reactive(new Map<string, QueueState>())
  const grandTotal = ref(0)
  const { issueSpentHoursMap, fetchSpentHours } = useIssueSpentHours(computed(() => myIssues.value.display.estimation))

  function parseQueues(): string[] {
    const raw = route.query.queues ?? route.query.queue
    if (typeof raw === 'string' && raw) return raw.split(',').filter(Boolean)
    return []
  }

  const parseStatuses = (): string[] => {
    const raw = route.query.statuses
    if (typeof raw === 'string' && raw) return raw.split(',')
    return [...DEFAULT_ISSUE_STATUSES]
  }

  const filters = reactive<IssueFilters>({
    statuses: parseStatuses(),
    priority: (route.query.priority as string) || null,
    queue: ''
  })

  const pushFiltersToUrl = () => {
    router.replace({
      query: {
        ...(selectedQueues.value.length ? { queues: selectedQueues.value.join(',') } : {}),
        ...(filters.statuses.length ? { statuses: filters.statuses.join(',') } : {}),
        ...(filters.priority ? { priority: filters.priority } : {}),
        ...(search.value ? { search: search.value } : {})
      }
    })
  }

  const search = ref((route.query.search as string) || '')

  const queueItems = computed(() =>
    selectedQueues.value.map(key => ({
      key,
      state: queueStates.get(key) ?? { issues: [], totalCount: 0 }
    }))
  )

  const totalIssues = computed(() => grandTotal.value)
  const filteredTotal = computed(() => queueItems.value.reduce((sum, item) => sum + item.state.issues.length, 0))

  const { runWithLoading: fetch, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value || !selectedQueues.value.length) {
      queueStates.clear()
      grandTotal.value = 0
      return
    }

    const query = buildFetchQuery(
      login.value,
      { ...filters, queue: selectedQueues.value.join(', '), search: search.value },
      myIssues.value.roles
    )

    const response = await retryOn429(
      () => yandexTrackerApi.issueSearchRaw({ query }, COMBINED_PAGE_SIZE),
      RATE_LIMIT_RETRIES
    )

    grandTotal.value = Number(response.headers.get('X-Total-Count') ?? response._data?.length ?? 0)
    const grouped = groupIssuesByQueue(response._data ?? [])

    queueStates.clear()
    selectedQueues.value.forEach(queue => {
      const issues = grouped[queue] ?? []
      queueStates.set(queue, {
        issues: sortByStatusPriority(issues).slice(0, QUEUE_PREVIEW_SIZE),
        totalCount: issues.length
      })
    })

    await fetchSpentHours(queueItems.value.flatMap(item => item.state.issues))
  })

  const applyFilters = async () => {
    pushFiltersToUrl()
    await fetch()
  }

  const refresh = async () => {
    await fetch()
  }

  watch(
    queuesModel,
    async queues => {
      if (!queues.length || selectedQueues.value.length || route.query.queues || route.query.queue) return
      selectedQueues.value = queues.map(queue => queue.key)
      await fetch()
    },
    { immediate: true }
  )

  watch(
    login,
    async newLogin => {
      if (newLogin) await fetch()
    },
    { immediate: true }
  )

  useIssueBus(({ key, status }) => {
    for (const state of queueStates.values()) {
      const issue = state.issues.find(i => i.key === key)
      if (!issue) continue
      if (!filters.statuses.includes(status.key)) state.issues = state.issues.filter(i => i.key !== key)
      else issue.status = status
    }
  })

  return {
    queueItems,
    selectedQueues,
    issueSpentHoursMap,
    filters,
    search,
    totalIssues,
    filteredTotal,
    isLoading,
    fetch,
    applyFilters,
    refresh
  }
})
