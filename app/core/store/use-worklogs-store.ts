import {
  format as formatDate,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  addWeeks,
  addMonths,
  addDays
} from 'date-fns'
import type { DateDuration } from '../types'
import { useAuthStore } from './use-auth-store'
import { calculateTotalHours, formatHoursToFixed, LOCAL_UTC_ISO } from '../utils/time'
import type { WorklogFormat } from '../types/worklogs'
import { useNow } from '@vueuse/core'
import { useWorklogsFetch } from '../composables/use-worklogs-fetch'

const periodStart = (d: Date, fmt: WorklogFormat): Date => {
  if (fmt === 'week') return startOfWeek(d, { weekStartsOn: 1 })
  if (fmt === 'month') return startOfMonth(d)
  return startOfDay(d)
}

const periodEnd = (d: Date, fmt: WorklogFormat): Date => {
  if (fmt === 'week') return endOfWeek(d, { weekStartsOn: 1 })
  if (fmt === 'month') return endOfMonth(d)
  return endOfDay(d)
}

export const shiftPeriod = (isoFrom: string, fmt: WorklogFormat, n: number) => {
  const base = parseISO(isoFrom.slice(0, 10))
  let shifted: Date
  if (fmt === 'week') shifted = addWeeks(base, n)
  else if (fmt === 'month') shifted = addMonths(base, n)
  else shifted = addDays(base, n)
  return {
    from: formatDate(periodStart(shifted, fmt), LOCAL_UTC_ISO),
    to: formatDate(periodEnd(shifted, fmt), LOCAL_UTC_ISO)
  }
}

export const useWorklogsStore = (format: WorklogFormat, key: string) =>
  defineStore(`worklogs:${format}:${key}`, () => {
    const { login } = storeToRefs(useAuthStore())

    const now = useNow()

    const params = ref<DateDuration>({
      from: formatDate(periodStart(now.value, format), LOCAL_UTC_ISO),
      to: formatDate(periodEnd(now.value, format), LOCAL_UTC_ISO)
    })

    const fromRef = computed(() => params.value.from)
    const toRef = computed(() => params.value.to)

    const { worklogsModel, refresh, isLoading } = useWorklogsFetch(fromRef, toRef)

    const next = async () => {
      const { from, to } = shiftPeriod(params.value.from, format, 1)
      params.value.from = from
      params.value.to = to
      await refresh()
    }

    const prev = async () => {
      const { from, to } = shiftPeriod(params.value.from, format, -1)
      params.value.from = from
      params.value.to = to
      await refresh()
    }

    const totalHours = computed(() =>
      worklogsModel.value.length > 0 ? formatHoursToFixed(calculateTotalHours(worklogsModel.value)) : 0
    )

    watch(
      login,
      async newLogin => {
        if (newLogin && worklogsModel.value.length === 0) {
          await refresh()
        }
      },
      { immediate: true }
    )

    return {
      worklogsModel,
      params,
      next,
      prev,
      refresh,
      isLoading,
      totalHours
    }
  })()
