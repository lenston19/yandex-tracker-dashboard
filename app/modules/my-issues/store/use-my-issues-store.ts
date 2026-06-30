import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { buildFetchQuery, groupIssuesByQueue, sortByStatusPriority, QUEUE_PREVIEW_SIZE } from '~/core/utils/my-issues'
import type { IssueFilters } from '~/core/utils/my-issues'
import { DEFAULT_ISSUE_STATUSES } from '~/core/constants/issues'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useIssueBus } from '~/core/composables/use-issue-bus'
import { fetchAllPages } from '~/core/utils/fetch-all-pages'
import { useIssueSpentHours } from '~/core/composables/use-issue-spent-hours'

const PER_PAGE = 50

export const useMyIssuesStore = defineStore('my-issues-page', () => {
  const { login } = storeToRefs(useAuthStore())
  const { myIssues } = storeToRefs(useSiteSettingsStore())
  const route = useRoute()
  const router = useRouter()

  const allIssues = ref<Yandex.Issue[]>([])
  const { issueSpentHoursMap, fetchSpentHours } = useIssueSpentHours(computed(() => myIssues.value.display.estimation))

  const parseStatuses = (): string[] => {
    const raw = route.query.statuses
    if (typeof raw === 'string' && raw) return raw.split(',')
    return [...DEFAULT_ISSUE_STATUSES]
  }

  const filters = reactive<IssueFilters>({
    statuses: parseStatuses(),
    priority: (route.query.priority as string) || null,
    queue: (route.query.queue as string) || ''
  })

  const pushFiltersToUrl = () => {
    router.replace({
      query: {
        ...(filters.statuses.length ? { statuses: filters.statuses.join(',') } : {}),
        ...(filters.priority ? { priority: filters.priority } : {}),
        ...(filters.queue ? { queue: filters.queue } : {})
      }
    })
  }

  const search = ref('')

  const filteredIssues = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return allIssues.value
    return allIssues.value.filter(i => i.summary.toLowerCase().includes(q) || i.key.toLowerCase().includes(q))
  })

  const allIssuesByQueue = computed(() => groupIssuesByQueue(filteredIssues.value))

  const issuesByQueue = computed(() =>
    Object.fromEntries(
      Object.entries(allIssuesByQueue.value).map(([key, issues]) => [
        key,
        sortByStatusPriority(issues).slice(0, QUEUE_PREVIEW_SIZE)
      ])
    )
  )

  const issueTotalByQueue = computed(() =>
    Object.fromEntries(Object.entries(allIssuesByQueue.value).map(([key, issues]) => [key, issues.length]))
  )

  const totalIssues = computed(() => allIssues.value.length)
  const filteredTotal = computed(() => filteredIssues.value.length)

  const fetchQuery = computed(() => buildFetchQuery(login.value ?? '', filters, myIssues.value.roles))

  const { runWithLoading: fetch, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value) {
      allIssues.value = []
      return
    }

    const response = await yandexTrackerApi.issueSearchRaw({ query: fetchQuery.value }, PER_PAGE)

    if (!response._data) {
      allIssues.value = []
      return
    }

    const totalPages = response.headers.get('X-Total-Pages')
    const totalCount = response.headers.get('X-Total-Count')

    let result: Yandex.Issue[] = [...response._data]

    if (totalPages && totalCount && +totalCount > PER_PAGE) {
      const rest = await fetchAllPages(
        page => yandexTrackerApi.issueSearchRaw({ query: fetchQuery.value }, PER_PAGE, page),
        +totalPages
      )
      result = [...result, ...rest]
    }

    allIssues.value = result
    await fetchSpentHours(allIssues.value)
  })

  const applyFilters = async () => {
    pushFiltersToUrl()
    await fetch()
  }

  const refresh = async () => {
    await fetch()
  }

  watch(
    login,
    async newLogin => {
      if (newLogin) await fetch()
    },
    { immediate: true }
  )

  useIssueBus(({ key, status }) => {
    const index = allIssues.value.findIndex(i => i.key === key)
    if (index === -1) return
    if (!filters.statuses.includes(status.key)) {
      allIssues.value.splice(index, 1)
    } else {
      allIssues.value[index]!.status = status
    }
  })

  return {
    allIssues,
    issuesByQueue,
    issueTotalByQueue,
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
