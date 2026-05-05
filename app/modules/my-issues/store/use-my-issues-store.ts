import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { buildFetchQuery, groupIssuesByQueue, sortByPriority } from '~/core/utils/my-issues'
import type { IssueFilters } from '~/core/utils/my-issues'
import { DEFAULT_ISSUE_STATUSES } from '~/core/constants/issues'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useIssueBus } from '~/core/composables/use-issue-events'

const MAX_FETCH = 200
export const PAGE_SIZE = 20

export const useMyIssuesStore = defineStore('my-issues-page', () => {
  const { login } = storeToRefs(useAuthStore())
  const { myIssues } = storeToRefs(useSiteSettingsStore())
  const route = useRoute()
  const router = useRouter()

  const page = ref(1)
  const allIssues = ref<Yandex.Issue[]>([])

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

  const paginatedIssues = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return allIssues.value.slice(start, start + PAGE_SIZE)
  })

  const issuesByQueue = computed(() => groupIssuesByQueue(paginatedIssues.value))
  const totalIssues = computed(() => allIssues.value.length)

  const fetchQuery = computed(() => buildFetchQuery(login.value ?? '', filters, myIssues.value.roles))

  const { runWithLoading: fetch, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value) {
      allIssues.value = []
      return
    }
    const data = await yandexTrackerApi.issueSearch({ query: fetchQuery.value }, MAX_FETCH, 1)
    allIssues.value = sortByPriority(data ?? [])
  })

  const applyFilters = async () => {
    page.value = 1
    pushFiltersToUrl()
    await fetch()
  }

  const refresh = async () => {
    page.value = 1
    await fetch()
  }

  watch(
    login,
    async newLogin => {
      if (newLogin) await fetch()
    },
    { immediate: true }
  )

  useIssueBus(fetch)

  return {
    allIssues,
    issuesByQueue,
    filters,
    page,
    totalIssues,
    isLoading,
    fetch,
    applyFilters,
    refresh
  }
})
