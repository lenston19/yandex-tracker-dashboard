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
import yandexTrackerApi from '../api/yandex-tracker.api'
import type { DateDuration } from '../types'
import type { YandexTrackerApi } from '../types/api/yandex-tracker/yandex-tracker.api'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from './use-auth-store'
import { calculateTotalHours, formatHoursToFixed } from '../utils/time'
import type { WorklogFormat } from '../types/worklogs'
import { useNow } from '@vueuse/core'
import { useTryCatchWithLoading } from '../composables/use-try-catch-with-loading'

const LOCAL_UTC_ISO = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"

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

const shiftPeriod = (isoFrom: string, fmt: WorklogFormat, n: number) => {
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

    const worklogsModel = ref<Yandex.Worklog[]>([])

    const now = useNow()

    const params = ref<DateDuration>({
      from: formatDate(periodStart(now.value, format), LOCAL_UTC_ISO),
      to: formatDate(periodEnd(now.value, format), LOCAL_UTC_ISO)
    })

    const fetchMoreWorklog = async (body: YandexTrackerApi.worklogList.Body, totalPages: number) => {
      let counter = 2
      const worklogs: Yandex.Worklog[] = []
      while (counter <= totalPages) {
        const iterResponse = await yandexTrackerApi.worklogList(body, {
          page: String(counter)
        })
        if (iterResponse.status === 200 && iterResponse._data) {
          worklogs.push(...iterResponse._data)
        }
        counter++
      }
      return worklogs
    }

    const { runWithLoading: refresh, isLoading } = useTryCatchWithLoading(async () => {
      if (!login.value) {
        worklogsModel.value = []
        return
      }

      const body: YandexTrackerApi.worklogList.Body = {
        createdBy: login.value,
        start: {
          from: params.value.from,
          to: params.value.to
        }
      }

      const response = await yandexTrackerApi.worklogList(body)

      if (!response._data) {
        worklogsModel.value = []
        return
      }

      const totalPages = response.headers.get('X-Total-Pages')
      const totalCount = response.headers.get('X-Total-Count')

      let allWorklogs: Yandex.Worklog[] = []
      if (totalPages && totalCount && +totalCount > 50) {
        allWorklogs = await fetchMoreWorklog(body, +totalPages)
      }

      const merged = [...response._data, ...allWorklogs]
      worklogsModel.value = merged.filter((w, i, arr) => arr.findIndex(x => x.id === w.id) === i)
    })

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
