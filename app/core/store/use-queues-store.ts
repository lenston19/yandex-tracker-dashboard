import yandexTrackerApi from '../api/yandex-tracker.api'
import { useTryCatchWithLoading } from '../composables/use-try-catch-with-loading'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from './use-auth-store'
import { fetchAllPages } from '../utils/fetch-all-pages'

export const useQueuesStore = defineStore('queues', () => {
  const { login } = storeToRefs(useAuthStore())

  const queuesModel = ref<Yandex.Queue[]>([])

  const { runWithLoading: refresh, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value) {
      queuesModel.value = []
      return
    }
    const response = await yandexTrackerApi.queuesList()

    if (!response._data) {
      queuesModel.value = []
      return
    }

    const totalPages = response.headers.get('X-Total-Pages')
    const totalCount = response.headers.get('X-Total-Count')

    let allQueues: Yandex.Queue[] = []
    if (totalPages && totalCount && +totalCount > 50) {
      allQueues = await fetchAllPages(page => yandexTrackerApi.queuesList({ page }), +totalPages)
    }

    const merged = [...response._data, ...allQueues]
    queuesModel.value = merged.filter((q, i, arr) => arr.findIndex(x => x.id === q.id) === i)
  })

  watch(
    login,
    async newLogin => {
      if (newLogin && queuesModel.value.length === 0) {
        await refresh()
      }
    },
    { immediate: true }
  )

  return {
    queuesModel,
    refresh,
    isLoading
  }
})
