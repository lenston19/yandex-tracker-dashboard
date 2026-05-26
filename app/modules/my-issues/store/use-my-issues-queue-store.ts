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
        ...(filters.priority ? { priority: filters.priority } : {})
      }
    })
  }

  const search = ref('')

  const filteredIssues = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return allIssues.value
    return allIssues.value.filter(i => i.summary.toLowerCase().includes(q) || i.key.toLowerCase().includes(q))
  })

  const paginatedIssues = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filteredIssues.value.slice(start, start + PAGE_SIZE)
  })

  const totalIssues = computed(() => filteredIssues.value.length)

  const fetchQuery = computed(() =>
    buildFetchQuery(login.value ?? '', { ...filters, queue: queueKey.value }, myIssues.value.roles)
  )

  const { runWithLoading: fetch, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value || !queueKey.value) {
      allIssues.value = []
      return
    }
    const data = await yandexTrackerApi.issueSearch({ query: fetchQuery.value }, 200, 1)
    allIssues.value = data ?? []
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
    queueKey,
    async key => {
      if (key) {
        page.value = 1
        await fetch()
      }
    },
    { immediate: true }
  )

  watch(login, async newLogin => {
    if (newLogin) await fetch()
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
    paginatedIssues,
    filters,
    search,
    page,
    totalIssues,
    isLoading,
    applyFilters,
    refresh
  }
})
