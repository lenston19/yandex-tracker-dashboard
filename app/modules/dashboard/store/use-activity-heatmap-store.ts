import { format as formatDate, subDays, startOfDay, endOfDay } from 'date-fns'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useSiteSettingsStore } from '~/modules/settings'
import { useWorklogsFetch } from '~/core/composables/use-worklogs-fetch'
import { calculateTotalHours, formatHoursToFixed, LOCAL_UTC_ISO } from '~/core/utils/time'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { useWorklogBus } from '~/core/composables/use-worklog-bus'

export const useActivityHeatmapStore = defineStore('activity-heatmap', () => {
  const { login } = storeToRefs(useAuthStore())
  const { heatmap } = storeToRefs(useSiteSettingsStore())
  const { formatShortDate } = useDateFormatter()

  const from = computed(() => formatDate(startOfDay(subDays(new Date(), heatmap.value.weeks * 7)), LOCAL_UTC_ISO))
  const to = computed(() => formatDate(endOfDay(new Date()), LOCAL_UTC_ISO))

  const { worklogsModel, refresh, isLoading, addWorklog, removeWorklog } = useWorklogsFetch(from, to)

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

  useWorklogBus('saved', addWorklog)
  useWorklogBus('deleted', removeWorklog)

  return { dayMap, isLoading, refresh, formatTooltip }
})
