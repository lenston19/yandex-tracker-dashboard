import { defineStore, storeToRefs } from 'pinia'
import { ref } from '#imports'
import yandexTrackerApi from '~/api/yandex-tracker.api'
import { useAuthStore } from '~/store/auth'
import { DateTime } from 'luxon'
import { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { YandexTrackerApi } from '~/types/yandex-tracker/yandex-tracker.api'
import { calculateHours, calculateTimeByPeriod } from '~/helpers/utils/time'

export const useMonthTimeWidgetStore = defineStore('month-time-widget', () => {
	const { login } = storeToRefs(useAuthStore())

	const allWorklogs = ref<Yandex.Worklog[]>([])

	const fetchMoreWorklog = async (body: YandexTrackerApi.worklogList.GET.RequestDTO, totalPages: number) => {
		let counter = 2
		let worklogs: Yandex.Worklog[] = []
		while (counter <= totalPages) {
			const iterResponse = await yandexTrackerApi.worklogList(body, {
				page: String(counter)
			})
			if (iterResponse.status === 200 && iterResponse._data) {
				worklogs = [
					...worklogs,
					...iterResponse._data
				]
			}
			counter++
		}
		return worklogs
	}

	const {
		data: _,
		refresh: refreshWorklogsMonth,
		status: requestStatus
	} = useLazyAsyncData('worklogs-month-items', async () => {
		allWorklogs.value = []
		if (!login.value) {
			return [] as Yandex.Worklog[]
		}
		const body = {
			createdBy: login.value,
			createdAt: {
				from: DateTime.now().startOf('month').toISO(),
				to: DateTime.now().endOf('month').toISO()
			},
		}

		const response = await yandexTrackerApi.worklogList(body)

		if (!response._data) {
			return [] as Yandex.Worklog[]
		}

		const totalPages = response.headers.get('X-Total-Pages')
		const totalCount = response.headers.get('X-Total-Count')
		let responseAllWorklogs: Yandex.Worklog[] = []
		if (totalPages && (totalCount && +totalCount > 50)) {
			responseAllWorklogs = await fetchMoreWorklog(body, +totalPages)
		}
		allWorklogs.value = [...response._data, ...responseAllWorklogs]

		return response._data
	}, {
		server: false,
		immediate: false
	})

	const totalHours = computed(() => {
		if (allWorklogs.value) {
			return calculateTimeByPeriod(calculateHours(allWorklogs.value))
		}
		return 0
	})

	return {
		totalHours,
		allWorklogs,
		requestStatus,
		refreshWorklogsMonth,
	}
})
