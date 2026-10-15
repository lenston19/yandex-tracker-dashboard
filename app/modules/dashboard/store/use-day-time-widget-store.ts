import { parseISO } from 'date-fns'
import { calculateTotalHours, formatHoursToFixed } from '~/core/utils/time'
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useDateFormatter } from '~/core/composables/use-date-formatter'

export const useDayTimeWidgetStore = defineStore('day-time-widget', () => {
  // "Сегодня" всегда внутри текущего месяца — переиспользуем уже загруженные ворклоги
  // месяца (тот же стор, что и month-time-widget) вместо отдельного запроса за день.
  const worklogsStore = useWorklogsStore('month', 'month-time-widget')
  const { worklogsModel, isLoading } = storeToRefs(worklogsStore)
  const { isTodayInTz } = useDateFormatter()

  const totalHours = computed(() => {
    const worklogs = worklogsModel.value.filter(worklog => isTodayInTz(parseISO(worklog.start)))
    return formatHoursToFixed(calculateTotalHours(worklogs))
  })

  return {
    isLoading,
    totalHours,
    refresh: worklogsStore.refresh
  }
})
