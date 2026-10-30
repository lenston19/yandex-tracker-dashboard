import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { buildFetchQuery } from '~/core/utils/my-issues'
import type { IssueFilters } from '~/core/utils/my-issues'
import { DEFAULT_ISSUE_STATUSES } from '~/core/constants/issues'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useIssueBus } from '~/core/composables/use-issue-bus'

export const PAGE_SIZE = 20
const FETCH_PER_PAGE = PAGE_SIZE

export const useMyIssuesQueueStore = defineStore('my-issues-queue-page', () => {
  const { login } = storeToRefs(useAuthStore())
  const { myIssues } = storeToRefs(useSiteSettingsStore())
  const route = useRoute()
  const router = useRouter()

  const page = ref(1)
  const allIssues = ref<Yandex.Issue[]>([])

  const queueKey = computed(() => String(route.params.queue ?? ''))

  const parseStatuses = (): string[] => {
    const raw = route.query.statuses
    if (typeof raw === 'string' && raw) return raw.split(',')
    return [...DEFAULT_ISSUE_STATUSES]
  }

  const filters = reactive<Omit<IssueFilters, 'queue'>>({
    statuses: parseStatuses(),
    priority: (route.query.priority as string) || null
  })

  const pushFiltersToUrl = () => {
    router.replace({
      query: {
        ...(filters.statuses.length ? { statuses: filters.statuses.join(',') } : {}),
        ...(filters.priority ? { priority: filters.priority } : {}),
        ...(search.value ? { search: search.value } : {})
      }
    })
  }

  const search = ref((route.query.search as string) || '')

  const filteredIssues = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return allIssues.value
    return allIssues.value.filter(i => i.summary.toLowerCase().includes(q) || i.key.toLowerCase().includes(q))
  })

  const totalCount = ref(0)
  const totalIssues = computed(() => totalCount.value)

  const fetchQuery = computed(() =>
    buildFetchQuery(
      login.value ?? '',
      { ...filters, queue: queueKey.value, search: search.value },
      myIssues.value.roles
    )
  )

  const { runWithLoading: fetch, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value || !queueKey.value) {
      allIssues.value = []
      totalCount.value = 0
      return
    }
    const response = await yandexTrackerApi.issueSearchRaw(
      { query: fetchQuery.value },
      FETCH_PER_PAGE,
      String(page.value)
    )

    if (!response._data) {
      allIssues.value = []
      totalCount.value = 0
      return
    }

    allIssues.value = response._data
    totalCount.value = Number(response.headers.get('X-Total-Count') ?? allIssues.value.length)
  })

  // page уже 1 → watch(page) не сработает на присвоение того же значения, фетчим сами;
  // иначе сброс страницы и фетч по новым данным сделает watch(page) один раз.
  const resetToFirstPage = async () => {
    if (page.value === 1) await fetch()
    else page.value = 1
  }

  const applyFilters = async () => {
    pushFiltersToUrl()
    await resetToFirstPage()
  }

  const refresh = () => resetToFirstPage()

  watch(
    queueKey,
    async key => {
      if (key) await resetToFirstPage()
    },
    { immediate: true }
  )

  watch(login, async newLogin => {
    if (newLogin) await fetch()
  })

  watch(page, async () => {
    if (queueKey.value) await fetch()
  })

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
    paginatedIssues: filteredIssues,
    filters,
    search,
    page,
    totalIssues,
    isLoading,
    applyFilters,
    refresh
  }
})
