import { format as formatDate, subDays, startOfDay, endOfDay } from 'date-fns'
import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useSiteSettingsStore } from '~/modules/settings'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { calculateTotalHours, formatHoursToFixed } from '~/core/utils/time'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

const LOCAL_UTC_ISO = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

export const useActivityHeatmapStore = defineStore('activity-heatmap', () => {
  const { login } = storeToRefs(useAuthStore())
  const { heatmap } = storeToRefs(useSiteSettingsStore())
  const { formatShortDate } = useDateFormatter()

  const worklogsModel = ref<Yandex.Worklog[]>([])

  const { runWithLoading: refresh, isLoading } = useTryCatchWithLoading(async () => {
    if (!login.value) {
      worklogsModel.value = []
      return
    }

    const now = new Date()
    const from = formatDate(startOfDay(subDays(now, heatmap.value.weeks * 7)), LOCAL_UTC_ISO)
    const to = formatDate(endOfDay(now), LOCAL_UTC_ISO)

    const body = {
      createdBy: login.value,
      start: { from, to }
    }

    const response = await yandexTrackerApi.worklogList(body)

    if (!response._data) {
      worklogsModel.value = []
      return
    }

    const allWorklogs = [...response._data]

    const totalPages = response.headers.get('X-Total-Pages')
    const totalCount = response.headers.get('X-Total-Count')

    if (totalPages && totalCount && +totalCount > 50) {
      for (let page = 2; page <= +totalPages; page++) {
        const pageResp = await yandexTrackerApi.worklogList(body, { page: String(page) })
        if (pageResp._data) allWorklogs.push(...pageResp._data)
      }
    }

    worklogsModel.value = allWorklogs
  })

  const dayMap = computed(() => {
    const map = new Map<string, number>()
    for (const worklog of worklogsModel.value) {
      const key = worklog.start.slice(0, 10)
      const hours = calculateTotalHours([worklog])
      map.set(key, (map.get(key) ?? 0) + hours)
    }
    return map
  })

  const formatTooltip = (dateKey: string) => {
    const hours = dayMap.value.get(dateKey) ?? 0
    const label = formatShortDate(new Date(dateKey + 'T12:00:00'))
    return hours > 0 ? `${label}: ${formatHoursToFixed(hours)} ч` : label
  }

  watch(
    login,
    async () => {
      if (!login.value) return
      if (worklogsModel.value.length === 0) await refresh()
    },
    { immediate: true }
  )

  watch(
    () => heatmap.value.weeks,
    () => {
      if (!login.value) return
      worklogsModel.value = []
      refresh()
    }
  )

  return { dayMap, isLoading, refresh, formatTooltip }
})
