import { DateTime } from 'luxon'
import yandexTrackerApi from '~/api/yandex-tracker.api'
import type { DateDuration } from '~/types/base'
import type { YandexTrackerApi } from '~/types/yandex-tracker/yandex-tracker.api'
import type { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/stores/auth'
import { calculateTotalHours, formatHoursToFixed } from '~/helpers/utils/time'

export type WorklogFormat = 'month' | 'week' | 'day'

export const useWorklogsStore = (format: WorklogFormat, key: string) =>
	defineStore(`worklogs-${format}-${key}`, () => {
		const { login } = storeToRefs(useAuthStore())
		const worklogsModel = ref<Yandex.Worklog[]>([])

		const params = ref<DateDuration>({
			from: DateTime.local().startOf(format).toUTC(0, { keepLocalTime: true }).toISO(),
			to: DateTime.local().endOf(format).toUTC(0, { keepLocalTime: true }).toISO()
		})

		const next = async () => {
			const fromDateTime = DateTime.fromISO(params.value.from)
				.plus({ [format]: 1 })
				.toISO()
			const toDateTime = DateTime.fromISO(params.value.to)
				.plus({ [format]: 1 })
				.toISO()
			if (fromDateTime === null || toDateTime === null) {
				return
			}
			params.value.from = fromDateTime
			params.value.to = toDateTime
			await refresh()
		}

		const prev = async () => {
			const fromDateTime = DateTime.fromISO(params.value.from)
				.minus({ [format]: 1 })
				.toISO()
			const toDateTime = DateTime.fromISO(params.value.to)
				.minus({ [format]: 1 })
				.toISO()
			if (fromDateTime === null || toDateTime === null) {
				return
			}

			params.value.from = fromDateTime
			params.value.to = toDateTime
			await refresh()
		}

		const fetchMoreWorklog = async (body: YandexTrackerApi.worklogList.Body, totalPages: number) => {
			let counter = 2
			let worklogs: Yandex.Worklog[] = []
			while (counter <= totalPages) {
				const iterResponse = await yandexTrackerApi.worklogList(body, {
					page: String(counter)
				})
				if (iterResponse.status === 200 && iterResponse._data) {
					worklogs = [...worklogs, ...iterResponse._data]
				}
				counter++
			}
			return worklogs
		}

		const { refresh, status } = useLazyAsyncData(
			`worklogs-${format}-items`,
			async () => {
				if (!login.value) {
					return [] as Yandex.Worklog[]
				}
				const body = {
					createdBy: login.value,
					createdAt: {
						from: params.value.from,
						to: params.value.to
					}
				}

				const response = await yandexTrackerApi.worklogList(body)

				if (!response._data) {
					return [] as Yandex.Worklog[]
				}

				const totalPages = response.headers.get('X-Total-Pages')
				const totalCount = response.headers.get('X-Total-Count')
				let responseAllWorklogs: Yandex.Worklog[] = []
				if (totalPages && totalCount && +totalCount > 50) {
					responseAllWorklogs = await fetchMoreWorklog(body, +totalPages)
				}
				worklogsModel.value = [...response._data, ...responseAllWorklogs]

				return response._data
			},
			{
				server: false
			}
		)

		const isLoading = computed(() => status.value === 'pending')

		const totalHours = computed(() =>
			worklogsModel.value ? formatHoursToFixed(calculateTotalHours(worklogsModel.value)) : 0
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
