import { defineStore, storeToRefs } from 'pinia'
import { ref } from '#imports'
import yandexTrackerApi from '~/api/yandex-tracker.api'
import { useAuthStore } from '~/store/auth'
import { DateTime } from 'luxon'
import { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { YandexTrackerApi } from '~/types/yandex-tracker/yandex-tracker.api'
import { DateDuration, LineChartData } from '~/types/base'
import { calculateHours, calculateTimeByPeriod } from '~/helpers/utils/time'

export const useMonthlyReportStore = defineStore('monthly-report', () => {
	const { login } = storeToRefs(useAuthStore())

	const monthParams = ref<DateDuration>({
		from: DateTime.now().startOf('month').toISO(),
		to: DateTime.now().endOf('month').toISO()
	})

	const allWorklogs = ref<Yandex.Worklog[]>([])

	const monthChartData = ref<LineChartData>({
		labels: [],
		datasets: [
			{
				backgroundColor: 'rgba(56,142,60,0.2)',
				borderColor: 'rgba(56,142,60,1)',
				borderWidth: 2,
				hoverBackgroundColor: 'rgba(56,142,60,0.4)',
				hoverBorderColor: 'rgba(56,142,60,1)',
				data: []
			}
		]
	})

	const nextMonth = async () => {
		const fromDateTime = DateTime.fromISO(monthParams.value.from).plus({ month: 1 }).toISO()
		const toDateTime = DateTime.fromISO(monthParams.value.to).plus({ month: 1 }).toISO()
		if (fromDateTime === null || toDateTime === null) {
			return
		}
		monthParams.value.from = fromDateTime
		monthParams.value.to = toDateTime
		await refreshChartData();
	}

	const prevMonth = async () => {
		const fromDateTime = DateTime.fromISO(monthParams.value.from).minus({ month: 1 }).toISO()
		const toDateTime = DateTime.fromISO(monthParams.value.to).minus({ month: 1 }).toISO()
		if (fromDateTime === null || toDateTime === null) {
			return
		}

		monthParams.value.from = fromDateTime
		monthParams.value.to = toDateTime
		await refreshChartData();
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
		data: chartData,
		refresh: refreshChartData,
		status: requestStatus
	} = useLazyAsyncData('worklogs-month-items', async () => {
		if (!login.value) {
			return [] as Yandex.Worklog[]
		}
		const body = {
			createdBy: login.value,
			createdAt: {
				from: monthParams.value.from,
				to: monthParams.value.to
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
	})

	watchEffect(() => {
		if (requestStatus.value === 'success' && allWorklogs.value.length) {
			calcMonthStats()
		}
	})

	const calcMonthStats = () => {
		clearState()
		const fromDateTime = DateTime.fromISO(monthParams.value.from);
		const toDateTime = DateTime.fromISO(monthParams.value.to);

		let iterateDay = fromDateTime;

		const labels = [];
		const data = [];

		while (iterateDay <= toDateTime && iterateDay.hasSame(fromDateTime, 'month')) {
			const dayItems = allWorklogs.value.filter((item: Yandex.Worklog) =>
				DateTime.fromISO(item.start).hasSame(iterateDay, 'day')
			);

			labels.push(iterateDay.toFormat('dd'));
			data.push(calculateTimeByPeriod(calculateHours(dayItems)));

			iterateDay = iterateDay.plus({ day: 1 });
		}

		monthChartData.value.labels = labels;
		monthChartData.value.datasets[0].data = data;
	};

	const clearState = () => {
		monthChartData.value.labels = [];
		monthChartData.value.datasets[0].data = [];
	}

	return {
		monthParams,
		allWorklogs,
		nextMonth,
		prevMonth,
		monthChartData,
		chartData,
		refreshChartData,
	}
})
