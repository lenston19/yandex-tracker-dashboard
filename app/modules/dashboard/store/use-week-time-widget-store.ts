import { DateTime } from 'luxon'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { calculateTotalHours, formatHoursToFixed } from '~/core/utils/time'
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { collectWorklogsByQueue } from '~/core/utils/collecting'
import { pickMeterColors } from '~/core/utils/colors'
import { useModal } from 'vue-final-modal'
import type { Weekday } from '../types'
import { useQueuesStore } from '~/core/store/use-queues-store'

export const useWeekTimeWidgetStore = defineStore('week-time-widget', () => {
  const worklogsStore = useWorklogsStore('week', 'week-time-widget')
  const { worklogsModel, isLoading, params } = storeToRefs(worklogsStore)

  const queuesStore = useQueuesStore()
  const { queuesModel, isLoading: isLoadingQueue } = storeToRefs(queuesStore)

  const currentWeek = ref<Weekday[]>([])
  const weekTotalHours = ref<number>(0)

  const calcWeekStats = () => {
    clearState()
    let iterateDay = DateTime.fromISO(params.value.from)
    while (iterateDay.hasSame(DateTime.fromISO(params.value.from), 'week')) {
      const dayItems = worklogsModel.value.filter((item: Yandex.Worklog) =>
        DateTime.fromISO(item.start).hasSame(iterateDay, 'day')
      )
      const dayHours = formatHoursToFixed(calculateTotalHours(dayItems))
      weekTotalHours.value = weekTotalHours.value + dayHours

      currentWeek.value.push({
        weekday: iterateDay.toFormat('EEEE'),
        monthDay: iterateDay.toFormat('dd MMMM yyyy'),
        hours: dayHours,
        items: dayItems
      })
      iterateDay = iterateDay.plus({ day: 1 })
    }
  }

  const flatQueueWorklogs = computed(() => {
    if (isLoading.value && isLoadingQueue.value && !worklogsModel.value.length && !queuesModel.value.length) {
      return []
    }

    const queueWorklogs = collectWorklogsByQueue(queuesModel.value, worklogsModel.value)
    const selectedColors = pickMeterColors(queueWorklogs.length)
    const withHours = queueWorklogs.map((queue, index) => {
      const hours = queue.worklogs.reduce((acc, worklog) => {
        return acc + calculateTotalHours(worklog.items)
      }, 0)

      return {
        queueName: queue.queueName,
        hours,
        color: selectedColors[index % selectedColors.length] || ''
      }
    })
    const totalHours = withHours.reduce((acc, item) => acc + item.hours, 0)

    return withHours.map(item => ({
      ...item,
      percentage: totalHours > 0 ? +((item.hours / totalHours) * 100).toFixed(2) : 0
    }))
  })

  const clearState = () => {
    currentWeek.value = []
    weekTotalHours.value = 0
  }

  watchEffect(() => {
    if (!isLoading.value) {
      calcWeekStats()
    }
  })

  const { open, patchOptions } = useModal({
    component: defineAsyncComponent(() => import('../components/modals/day-info-modal.vue'))
  })

  function openDetailDayDialog(day: Weekday) {
    if (day.hours > 0) {
      patchOptions({ attrs: { day } })
      open()
    }
  }

  return {
    params,
    next: worklogsStore.next,
    prev: worklogsStore.prev,
    weekTotalHours,
    currentWeek,
    isLoading,
    refresh: worklogsStore.refresh,
    openDetailDayDialog,
    flatQueueWorklogs,
    isLoadingQueue
  }
})
