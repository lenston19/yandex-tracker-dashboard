import yandexTrackerApi from '../api/yandex-tracker.api'
import type { YandexTrackerApi } from '../types/api/yandex-tracker/yandex-tracker.api'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '../store/use-auth-store'
import { fetchAllPages } from '../utils/fetch-all-pages'
import { useTryCatchWithLoading } from './use-try-catch-with-loading'

export function useWorklogsFetch(from: Ref<string>, to: Ref<string>) {
  const { login } = storeToRefs(useAuthStore())
  const worklogsModel = ref<Yandex.Worklog[]>([])

  const { runWithLoading: refresh, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value) {
      worklogsModel.value = []
      return
    }

    const body: YandexTrackerApi.worklogList.Body = {
      createdBy: login.value,
      start: { from: from.value, to: to.value }
    }

    const response = await yandexTrackerApi.worklogList(body)
    if (!response._data) {
      worklogsModel.value = []
      return
    }

    const totalPages = response.headers.get('X-Total-Pages')
    const totalCount = response.headers.get('X-Total-Count')

    let extra: Yandex.Worklog[] = []
    if (totalPages && totalCount && +totalCount > 50) {
      extra = await fetchAllPages(page => yandexTrackerApi.worklogList(body, { page }), +totalPages)
    }

    const merged = [...response._data, ...extra]
    worklogsModel.value = merged.filter((w, i, arr) => arr.findIndex(x => x.id === w.id) === i)
  })

  return { worklogsModel, refresh, isLoading }
}
