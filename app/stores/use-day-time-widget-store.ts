import { DateTime } from 'luxon'
import { calculateTotalHours, formatHoursToFixed } from '~/helpers/utils/time'
import { useWorklogsStore } from '~/stores/use-worklogs-store'

export const useDayTimeWidgetStore = defineStore('day-time-widget', () => {
  const worklogsStore = useWorklogsStore('day', 'day-time-widget')
  const { worklogsModel, isLoading } = storeToRefs(worklogsStore)

  const totalHours = computed(() => {
    if (!worklogsModel.value) {
      return
    }
    const worklogs = worklogsModel.value.filter(worklog =>
      DateTime.now().hasSame(DateTime.fromISO(worklog.start), 'day')
    )
    return formatHoursToFixed(calculateTotalHours(worklogs))
  })

  return {
    isLoading,
    totalHours,
    refresh: worklogsStore.refresh
  }
})
