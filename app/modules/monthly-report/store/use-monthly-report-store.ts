import { DateTime } from 'luxon'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import type { PieChartData, LineChartData } from '~/core/types'
import { calculateTotalHours, formatHoursToFixed } from '~/core/utils/time'
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useQueuesStore } from '~/core/store/use-queues-store'
import { collectWorklogsByQueue } from '~/core/utils/collecting'
import { createPastelColorPicker } from '~/core/utils/colors'

export const useMonthlyReportStore = defineStore('monthly-report', () => {
  const worklogsStore = useWorklogsStore('month', 'monthly-report')
  const queueStore = useQueuesStore()

  const { queuesModel, isLoading: isLoadingQueue } = storeToRefs(queueStore)
  const { params, worklogsModel, isLoading: isLoadingWorklog, totalHours } = storeToRefs(worklogsStore)

  const monthLineChartData = ref<LineChartData>({
    labels: [],
    datasets: [
      {
        backgroundColor: 'rgba(56,142,60,0.2)',
        borderColor: 'rgba(56,142,60,1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(56,142,60,0.4)',
        hoverBorderColor: 'rgba(56,142,60,1)',
        data: []
      }
    ]
  })

  const monthPieChartData = ref<PieChartData>({
    labels: [],
    datasets: [
      {
        backgroundColor: [],
        data: []
      }
    ]
  })

  const isLoading = computed(() => isLoadingQueue.value || isLoadingWorklog.value)

  watch(isLoading, () => {
    calcPieMonthStats()
    calcLineMonthStats()
  })

  const calcPieMonthStats = () => {
    clearPieState()
    const labels: string[] = []
    const data: number[] = []
    const backgroundColor: string[] = []

    const colorPicker = createPastelColorPicker()

    collectWorklogsByQueue(queuesModel.value, worklogsModel.value).forEach(item => {
      const hours = item.worklogs.reduce((acc, worklog) => {
        acc += formatHoursToFixed(calculateTotalHours(worklog.items))
        return acc
      }, 0)

      labels.push(item.queueName)
      data.push(hours)
      backgroundColor.push(colorPicker.getNextColor())
    })

    const newData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor
        }
      ]
    }

    monthPieChartData.value = newData
  }

  const calcLineMonthStats = () => {
    clearLineState()

    const fromDateTime = DateTime.fromISO(params.value.from)
    const toDateTime = DateTime.fromISO(params.value.to)

    let iterateDay = fromDateTime

    const labels = []
    const data = []

    while (iterateDay <= toDateTime && iterateDay.hasSame(fromDateTime, 'month')) {
      const dayItems = worklogsModel.value.filter((item: Yandex.Worklog) =>
        DateTime.fromISO(item.start).hasSame(iterateDay, 'day')
      )

      labels.push(iterateDay.toFormat('dd'))
      data.push(formatHoursToFixed(calculateTotalHours(dayItems)))

      iterateDay = iterateDay.plus({ day: 1 })
    }

    monthLineChartData.value.labels = labels
    monthLineChartData.value.datasets[0]!.data = data
  }

  const clearLineState = () => {
    monthLineChartData.value.labels = []
    monthLineChartData.value.datasets[0]!.data = []
  }

  const clearPieState = () => {
    monthPieChartData.value.labels = []
    monthPieChartData.value.datasets[0]!.data = []
    monthPieChartData.value.datasets[0]!.backgroundColor = []
  }

  const averageHoursByMonth = computed(() => {
    let count = 0
    const total = monthLineChartData.value.datasets[0]!.data.reduce((acc, item) => {
      if (item > 0.25) {
        acc += item
        count += 1
      }
      return acc
    }, 0)
    const result = +(total / count).toFixed(2)
    return isNaN(result) ? 0 : result
  })

  return {
    params,
    next: worklogsStore.next,
    prev: worklogsStore.prev,
    isLoading,
    monthLineChartData,
    monthPieChartData,
    refresh: worklogsStore.refresh,
    averageHoursByMonth,
    totalHours
  }
})
