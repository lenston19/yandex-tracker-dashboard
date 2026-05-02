import { parseISO } from 'date-fns'
import { calculateTotalHours, formatHoursToFixed } from '~/core/utils/time'
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { worklogBus } from '~/core/composables/use-worklog-events'

export const useDayTimeWidgetStore = defineStore('day-time-widget', () => {
  const worklogsStore = useWorklogsStore('day', 'day-time-widget')
  const { worklogsModel, isLoading } = storeToRefs(worklogsStore)
  const { isTodayInTz } = useDateFormatter()

  const totalHours = computed(() => {
    if (!worklogsModel.value) {
      return
    }
    const worklogs = worklogsModel.value.filter(worklog => isTodayInTz(parseISO(worklog.start)))
    return formatHoursToFixed(calculateTotalHours(worklogs))
  })

  const unsubscribeWorklogBus = worklogBus.on(() => worklogsStore.refresh())
  onScopeDispose(() => unsubscribeWorklogBus())

  return {
    isLoading,
    totalHours,
    refresh: worklogsStore.refresh
  }
})
