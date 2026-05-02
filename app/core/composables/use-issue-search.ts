import { useDebounceFn } from '@vueuse/core'
import yandexTrackerApi from '../api/yandex-tracker.api'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '../store/use-auth-store'
import { buildIssueSearchQuery } from '../utils/issue-search'
import { useTryCatchWithLoading } from './use-try-catch-with-loading'

export const useIssueSearch = (statuses?: string[]) => {
  const { login } = storeToRefs(useAuthStore())

  const query = ref('')
  const results = ref<Yandex.Issue[]>([])

  const { runWithLoading: search, isLoading } = useTryCatchWithLoading(
    async (q: string) => {
      if (!q.trim()) {
        results.value = []
        return
      }
      const data = await yandexTrackerApi.issueSearch({
        query: buildIssueSearchQuery(login.value ?? '', q, statuses),
        fields: 'summary,status,assignee,reviewer,qaEngineer'
      })
      results.value = data ?? []
    },
    {
      catchCallback: () => {
        results.value = []
      }
    }
  )

  const debouncedSearch = useDebounceFn(search, 500)

  watch(query, debouncedSearch)

  const clear = () => {
    query.value = ''
    results.value = []
  }

  return {
    query,
    results,
    isLoading,
    clear
  }
}
