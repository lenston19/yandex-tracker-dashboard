import yandexTrackerApi from '../api/yandex-tracker.api'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from './use-auth-store'

export const useQueuesStore = defineStore('queues', () => {
  const { login } = storeToRefs(useAuthStore())

  const queuesModel = ref<Yandex.Queue[]>([])

  const fetchMoreQueues = async (totalPages: number) => {
    let counter = 2
    const queues: Yandex.Queue[] = []

    while (counter <= totalPages) {
      const iterResponse = await yandexTrackerApi.queuesList({
        page: String(counter)
      })
      if (iterResponse.status === 200 && iterResponse._data) {
        queues.push(...iterResponse._data)
      }
      counter++
    }

    return queues
  }

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
      allQueues = await fetchMoreQueues(+totalPages)
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
