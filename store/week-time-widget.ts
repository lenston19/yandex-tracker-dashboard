import { defineStore, storeToRefs } from 'pinia'
import { useLazyAsyncData } from '#app'
import { ref } from '#imports'
import yandexTrackerApi from '~/api/yandex-tracker.api'
import { useAuthStore } from '~/store/auth'
import { DateTime } from 'luxon'
import { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { YandexTrackerApi } from '~/types/yandex-tracker/yandex-tracker.api'
import { calculateHours, calculateTimeByPeriod } from '~/helpers/utils/time'
import { DateDuration } from '~/types/base'

interface Weekday {
	weekday: string;
	monthDay: string;
	hours: number;
	items: Yandex.Worklog[];
}

export const useWeekTimeWidgetStore = defineStore('week-time-widget', () => {
	const { login } = storeToRefs(useAuthStore())

	const weekParams = ref<DateDuration>({
		from: DateTime.now().startOf('week').toISO(),
		to: DateTime.now().endOf('week').toISO()
	})

	const allWorklogs = ref<Yandex.Worklog[]>([])

	const currentWeek = ref<Weekday[]>([]);
	const weekTotalHours = ref<number>(0)

	const nextWeek = async () => {
		const fromDateTime = DateTime.fromISO(weekParams.value.from).plus({ week: 1 }).toISO()
		const toDateTime = DateTime.fromISO(weekParams.value.to).plus({ week: 1 }).toISO()
		if (fromDateTime === null || toDateTime === null) {
			return
		}
		weekParams.value.from = fromDateTime
		weekParams.value.to = toDateTime
		await refreshWorklogsWeek();
	}

	const prevWeek = async () => {
		const fromDateTime = DateTime.fromISO(weekParams.value.from).minus({ week: 1 }).toISO()
		const toDateTime = DateTime.fromISO(weekParams.value.to).minus({ week: 1 }).toISO()
		if (fromDateTime === null || toDateTime === null) {
			return
		}

		weekParams.value.from = fromDateTime
		weekParams.value.to = toDateTime
		await refreshWorklogsWeek();
	}

	const fetchMoreWorklog = async (body: YandexTrackerApi.worklogList.GET.RequestDTO, totalPages: number) => {
		let counter = 1
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
		data: worklogsWeek,
		refresh: refreshWorklogsWeek,
		status: requestStatus
	} = useLazyAsyncData('worklogs-week-items', async () => {
		if (!login.value) {
			return [] as Yandex.Worklog[]
		}
		clearState()
		const body = {
			createdBy: login.value,
			createdAt: {
				from: weekParams.value.from,
				to: weekParams.value.to,
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
		default: () => [] as Yandex.Worklog[],
		server: false,
		immediate: false
	})

	const calcWeekStats = () => {
		clearState()
		let iterateDay = DateTime.fromISO(weekParams.value.from);
		while (iterateDay.hasSame(DateTime.fromISO(weekParams.value.from), 'week')) {
			const dayItems = allWorklogs.value.filter((item: Yandex.Worklog) =>
				DateTime.fromISO(item.start).hasSame(iterateDay, 'day')
			);
			const dayHours = calculateTimeByPeriod(calculateHours(dayItems));
			weekTotalHours.value = weekTotalHours.value + dayHours;

			currentWeek.value.push({
				weekday: iterateDay.setLocale('ru').toFormat('EEEE'),
				monthDay: iterateDay.setLocale('ru').toFormat('dd MMMM yyyy'),
				hours: dayHours,
				items: dayItems,
			});
			iterateDay = iterateDay.plus({ day: 1 });
		}
	};

	const clearState = () => {
		currentWeek.value = []
		weekTotalHours.value = 0
	}

	watchEffect(() => {
		if (requestStatus.value === 'success' && allWorklogs.value.length) {
			calcWeekStats()
		}
	})

	return {
		weekParams,
		nextWeek,
		prevWeek,
		weekTotalHours,
		currentWeek,
		requestStatus,
		refreshWorklogsWeek,
	}
})
