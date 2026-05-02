import { addDays, endOfMonth, isAfter, startOfDay, startOfMonth } from 'date-fns'
import { useNow } from '@vueuse/core'
import { isWorkingDay } from '~/core/composables/use-production-calendar'

export function useWorkTimeSettings() {
  const hoursInDay = ref<number>(8)
  const gold = ref<number>(0)
  const isShowWeeklyLoading = ref<boolean>(false)
  const needHoursInCurrentMonth = ref<number>(0)
  const remainingWorkdays = ref<number>(0)

  const now = useNow()

  async function updateCalendarStats() {
    const today = now.value
    const monthEnd = endOfMonth(today)
    const todayStart = startOfDay(today)
    let totalWorkdays = 0
    let remaining = 0

    for (let d = startOfMonth(today); !isAfter(d, monthEnd); d = addDays(d, 1)) {
      if (await isWorkingDay(d)) {
        totalWorkdays++
        if (!isAfter(todayStart, d)) remaining++
      }
    }

    needHoursInCurrentMonth.value = totalWorkdays * hoursInDay.value
    remainingWorkdays.value = remaining
  }

  const currentDayKey = computed(() => now.value.toDateString())
  watch(currentDayKey, updateCalendarStats, { immediate: true })
  watch(hoursInDay, updateCalendarStats)

  return {
    hoursInDay,
    gold,
    isShowWeeklyLoading,
    needHoursInCurrentMonth,
    remainingWorkdays
  }
}
