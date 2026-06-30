import { addDays, isToday, isSameISOWeek, parseISO } from 'date-fns'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { calculateTotalHours, formatHoursToFixed, parseDateOnly } from '~/core/utils/time'
import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useWorklogBus } from '~/core/composables/use-worklog-bus'
import { collectWorklogsByQueue } from '~/core/utils/collecting'
import { pickMeterColors } from '~/core/utils/colors'
import type { Weekday } from '../types'
import { useQueuesStore } from '~/core/store/use-queues-store'
import { useDateFormatter } from '~/core/composables/use-date-formatter'
import { isWorkingDay } from '~/core/composables/use-production-calendar'
import { useSiteSettingsStore } from '~/modules/settings'
import { SITEMAP } from '~/core/utils/router/sitemap'

export const useWeekTimeWidgetStore = defineStore('week-time-widget', () => {
  const worklogsStore = useWorklogsStore('week', 'week-time-widget')
  const { worklogsModel, isLoading, params } = storeToRefs(worklogsStore)

  const queuesStore = useQueuesStore()
  const { queuesModel, isLoading: isLoadingQueue } = storeToRefs(queuesStore)

  const { hoursInDay } = storeToRefs(useSiteSettingsStore())

  const currentWeek = ref<Weekday[]>([])
  const weekTotalHours = ref<number>(0)
  const { formatWeekday, formatFullDate, formatDayMonth, formatDayKey, isSameDayInTz } = useDateFormatter()

  const calcWeekStats = async () => {
    clearState()
    const fromDate = parseDateOnly(params.value.from)

    const daysInWeek: Date[] = []
    let iterateDay = fromDate
    while (isSameISOWeek(iterateDay, fromDate)) {
      daysInWeek.push(iterateDay)
      iterateDay = addDays(iterateDay, 1)
    }

    const workingFlags = await Promise.all(daysInWeek.map(d => isWorkingDay(d)))

    let prevMonthKey: string | null = null
    daysInWeek.forEach((day, i) => {
      const holiday = !workingFlags[i]
      const dayItems = worklogsModel.value.filter((item: Yandex.Worklog) => isSameDayInTz(parseISO(item.start), day))
      const dayHours = formatHoursToFixed(calculateTotalHours(dayItems))
      weekTotalHours.value = weekTotalHours.value + dayHours

      const monthKey = formatDayKey(day).slice(0, 7)
      const isNewMonth = prevMonthKey !== null && monthKey !== prevMonthKey
      prevMonthKey = monthKey

      currentWeek.value.push({
        weekday: formatWeekday(day),
        monthDay: formatFullDate(day),
        shortDate: formatDayMonth(day),
        dateKey: formatDayKey(day).slice(0, 10),
        isNewMonth,
        hours: dayHours,
        isHoliday: holiday,
        isToday: isToday(day),
        items: dayItems
      })
    })
  }

  const flatQueueWorklogs = computed(() => {
    if ((isLoading.value || isLoadingQueue.value) && !worklogsModel.value.length && !queuesModel.value.length) {
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

  watch(isLoading, async loading => {
    if (!loading) await calcWeekStats()
  })

  watch(worklogsModel, async () => {
    if (!isLoading.value) await calcWeekStats()
  })

  useWorklogBus('saved', worklogsStore.addWorklog)
  useWorklogBus('deleted', worklogsStore.removeWorklog)

  function openDetailDay(day: Weekday) {
    if (day.hours > 0) {
      navigateTo({ ...SITEMAP.dayView.route, params: { date: day.dateKey } })
    }
  }

  const weekProgressStatus = computed((): 'ahead' | 'on-track' | 'behind' | 'neutral' => {
    const todayInWeek = currentWeek.value.find(d => d.isToday)
    if (!todayInWeek || !currentWeek.value.length) return 'neutral'

    const todayIndex = currentWeek.value.indexOf(todayInWeek)
    const passedWorkingDays = currentWeek.value.slice(0, todayIndex + 1).filter(d => !d.isHoliday).length

    const dayHours = hoursInDay.value ?? 8
    const expectedByNow = passedWorkingDays * dayHours
    const diff = weekTotalHours.value - expectedByNow

    if (diff > 1) return 'ahead'
    if (diff < -1) return 'behind'
    return 'on-track'
  })

  return {
    params,
    next: worklogsStore.next,
    prev: worklogsStore.prev,
    weekTotalHours,
    currentWeek,
    isLoading,
    refresh: worklogsStore.refresh,
    openDetailDay,
    flatQueueWorklogs,
    isLoadingQueue,
    weekProgressStatus
  }
})
