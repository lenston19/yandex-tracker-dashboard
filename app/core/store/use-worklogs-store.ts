import { DateTime } from 'luxon'
import yandexTrackerApi from '../api/yandex-tracker.api'
import type { DateDuration } from '../types'
import type { YandexTrackerApi } from '../types/api/yandex-tracker/yandex-tracker.api'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from './use-auth-store'
import { calculateTotalHours, formatHoursToFixed } from '../utils/time'
import type { WorklogFormat } from '../types/worklogs'

export const useWorklogsStore = (format: WorklogFormat, key: string) =>
  defineStore(`worklogs:${format}:${key}`, () => {
    const { login } = storeToRefs(useAuthStore())

    const worklogsModel = ref<Yandex.Worklog[]>([])

    const params = ref<DateDuration>({
      from: DateTime.local().startOf(format).toUTC(0, { keepLocalTime: true }).toISO(),
      to: DateTime.local().endOf(format).toUTC(0, { keepLocalTime: true }).toISO()
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
      const newPeriod = DateTime.fromISO(params.value.from).plus({ [format]: 1 })
      const fromDateTime = newPeriod.startOf(format).toUTC(0, { keepLocalTime: true }).toISO()
      const toDateTime = newPeriod.endOf(format).toUTC(0, { keepLocalTime: true }).toISO()
      if (fromDateTime && toDateTime) {
        params.value.from = fromDateTime
        params.value.to = toDateTime
        await refresh()
      }
    }

    const prev = async () => {
      const newPeriod = DateTime.fromISO(params.value.from).minus({ [format]: 1 })
      const fromDateTime = newPeriod.startOf(format).toUTC(0, { keepLocalTime: true }).toISO()
      const toDateTime = newPeriod.endOf(format).toUTC(0, { keepLocalTime: true }).toISO()
      if (fromDateTime && toDateTime) {
        params.value.from = fromDateTime
        params.value.to = toDateTime
        await refresh()
      }
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
