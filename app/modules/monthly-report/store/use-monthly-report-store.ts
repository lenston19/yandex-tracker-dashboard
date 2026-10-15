import { addDays, isAfter, isSameMonth, parseISO } from 'date-fns'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import type { PieChartData, LineChartData } from '~/core/types'
import { calculateTotalHours, formatHoursToFixed, calculateDurationInHours } from '~/core/utils/time'
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useQueuesStore } from '~/core/store/use-queues-store'
import { collectWorklogsByQueue } from '~/core/utils/collecting'
import { createPastelColorPicker } from '~/core/utils/colors'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { useSiteSettingsStore } from '~/modules/settings'
import { useIssueAccuracy } from '~/core/composables/use-issue-accuracy'

const WEEKDAYS = [
  { name: 'понедельник', label: 'Пн' },
  { name: 'вторник', label: 'Вт' },
  { name: 'среда', label: 'Ср' },
  { name: 'четверг', label: 'Чт' },
  { name: 'пятница', label: 'Пт' },
  { name: 'суббота', label: 'Сб' },
  { name: 'воскресенье', label: 'Вс' }
] as const

export const useMonthlyReportStore = defineStore('monthly-report', () => {
  const worklogsStore = useWorklogsStore('month', 'monthly-report')
  const queueStore = useQueuesStore()

  const { queuesModel, isLoading: isLoadingQueue } = storeToRefs(queueStore)
  const { params, worklogsModel, isLoading: isLoadingWorklog, totalHours } = storeToRefs(worklogsStore)
  const { formatDay, formatWeekday, isSameDayInTz } = useDateFormatter()

  const {
    isLoading: isLoadingAccuracy,
    overEstimationIssues,
    totalOverageHours,
    estimationAccuracy,
    topIssuesByHours,
    accuracyByQueue
  } = useIssueAccuracy(worklogsModel, isLoadingWorklog)

  const monthLineChartData = ref<LineChartData>({
    labels: [],
    datasets: [
      {
        backgroundColor: 'var(--ui-color-success-500)',
        borderColor: 'var(--ui-color-success-300)',
        borderWidth: 2,
        hoverBackgroundColor: 'var(--ui-color-success-500)',
        hoverBorderColor: 'var(--ui-color-success-300)',
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

  const { timeZone, gold } = storeToRefs(useSiteSettingsStore())

  const isLoading = computed(() => isLoadingQueue.value || isLoadingAccuracy.value)

  watch([isLoadingQueue, isLoadingWorklog], () => {
    calcPieMonthStats()
    calcLineMonthStats()
  })

  watch(timeZone, () => {
    calcPieMonthStats()
    calcLineMonthStats()
  })

  const weekdayChartData = computed<LineChartData>(() => {
    const hoursByWeekday = new Map<string, number>(WEEKDAYS.map(day => [day.name, 0]))

    worklogsModel.value.forEach(worklog => {
      const weekday = formatWeekday(worklog.start).toLowerCase()
      const hours = calculateDurationInHours(worklog.duration)
      hoursByWeekday.set(weekday, (hoursByWeekday.get(weekday) ?? 0) + hours)
    })

    return {
      labels: WEEKDAYS.map(day => day.label),
      datasets: [
        {
          backgroundColor: 'var(--ui-color-primary-500)',
          borderColor: 'var(--ui-color-primary-500)',
          borderWidth: 0,
          hoverBackgroundColor: 'var(--ui-color-primary-500)',
          hoverBorderColor: 'var(--ui-color-primary-500)',
          data: WEEKDAYS.map(day => formatHoursToFixed(hoursByWeekday.get(day.name) ?? 0))
        }
      ]
    }
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

    const fromDate = parseISO(params.value.from.slice(0, 10))
    const toDate = parseISO(params.value.to.slice(0, 10))

    let iterateDay = fromDate

    const labels = []
    const data = []

    while (!isAfter(iterateDay, toDate) && isSameMonth(iterateDay, fromDate)) {
      const dayItems = worklogsModel.value.filter((item: Yandex.Worklog) =>
        isSameDayInTz(parseISO(item.start), iterateDay)
      )
      const hours = formatHoursToFixed(calculateTotalHours(dayItems))

      labels.push(formatDay(iterateDay))
      data.push(hours)

      iterateDay = addDays(iterateDay, 1)
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

  const earnedMoney = computed(() => formatHoursToFixed(totalHours.value * gold.value))

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
    totalHours,
    gold,
    earnedMoney,
    overEstimationIssues,
    totalOverageHours,
    estimationAccuracy,
    topIssuesByHours,
    weekdayChartData,
    accuracyByQueue
  }
})
