import { addDays, isAfter, isSameMonth, parseISO } from 'date-fns'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import type { PieChartData, LineChartData } from '~/core/types'
import type { IssueEstimationStat, TopIssueStat, EstimationAccuracy } from '../types'
import { calculateTotalHours, formatHoursToFixed, calculateDurationInHours } from '~/core/utils/time'
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useQueuesStore } from '~/core/store/use-queues-store'
import { collectWorklogs, collectWorklogsByQueue } from '~/core/utils/collecting'
import { createPastelColorPicker } from '~/core/utils/colors'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { useSiteSettingsStore } from '~/modules/settings'
import { buildIssuesByKeysQuery } from '~/core/utils/issue-search'
import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import { fetchAllPages } from '~/core/utils/fetch-all-pages'

const PER_PAGE = 50

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

  const issuesModel = ref<Yandex.Issue[]>([])
  const isLoadingIssues = ref(false)

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

  const isLoadingBase = computed(() => isLoadingQueue.value || isLoadingWorklog.value)
  const isLoading = computed(() => isLoadingBase.value || isLoadingIssues.value)

  watch(isLoadingBase, async loading => {
    calcPieMonthStats()
    calcLineMonthStats()
    if (!loading) {
      await fetchIssuesForMonth()
    }
  })

  watch(timeZone, () => {
    calcPieMonthStats()
    calcLineMonthStats()
  })

  const spentHoursByKey = computed(() => {
    const { groupedWorklogs } = collectWorklogs(worklogsModel.value)
    const map = new Map<string, number>()
    groupedWorklogs.forEach((items, key) => {
      map.set(key, formatHoursToFixed(calculateTotalHours(items)))
    })
    return map
  })

  const fetchIssuesForMonth = async () => {
    const keys = Array.from(spentHoursByKey.value.keys())
    if (!keys.length) {
      issuesModel.value = []
      return
    }

    isLoadingIssues.value = true
    try {
      const query = buildIssuesByKeysQuery(keys)
      const response = await yandexTrackerApi.issueSearchRaw({ query, fields: 'summary,estimation' }, PER_PAGE)

      if (!response._data) {
        issuesModel.value = []
        return
      }

      const totalPages = response.headers.get('X-Total-Pages')
      const totalCount = response.headers.get('X-Total-Count')

      let result: Yandex.Issue[] = [...response._data]

      if (totalPages && totalCount && +totalCount > PER_PAGE) {
        const rest = await fetchAllPages(
          page => yandexTrackerApi.issueSearchRaw({ query, fields: 'summary,estimation' }, PER_PAGE, page),
          +totalPages
        )
        result = [...result, ...rest]
      }

      issuesModel.value = result
    } finally {
      isLoadingIssues.value = false
    }
  }

  const hasEstimation = (issue: Yandex.Issue) => Boolean(issue.estimation) && issue.estimation !== 'PT0S'

  const overEstimationIssues = computed<IssueEstimationStat[]>(() => {
    return issuesModel.value
      .filter(hasEstimation)
      .map(issue => {
        const spentHours = spentHoursByKey.value.get(issue.key) ?? 0
        const estimationHours = calculateDurationInHours(issue.estimation!)
        return { issue, spentHours, estimationHours, overageHours: formatHoursToFixed(spentHours - estimationHours) }
      })
      .filter(stat => stat.overageHours > 0)
      .sort((a, b) => b.overageHours - a.overageHours)
  })

  const totalOverageHours = computed(() =>
    formatHoursToFixed(overEstimationIssues.value.reduce((acc, stat) => acc + stat.overageHours, 0))
  )

  const estimationAccuracy = computed<EstimationAccuracy>(() => {
    const total = issuesModel.value.filter(hasEstimation).length
    const withinEstimate = total - overEstimationIssues.value.length
    const percent = total > 0 ? Math.round((withinEstimate / total) * 100) : 0
    return { total, withinEstimate, percent }
  })

  const topIssuesByHours = computed<TopIssueStat[]>(() => {
    return issuesModel.value
      .map(issue => ({ issue, hours: spentHoursByKey.value.get(issue.key) ?? 0 }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5)
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

      labels.push(formatDay(iterateDay))
      data.push(formatHoursToFixed(calculateTotalHours(dayItems)))

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
    weekdayChartData
  }
})
