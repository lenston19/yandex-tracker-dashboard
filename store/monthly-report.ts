import { defineStore, storeToRefs } from 'pinia'
import { ref } from '#imports'
import { DateTime } from 'luxon'
import { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { LineChartData } from '~/types/base'
import { calculateTotalHours, formatHoursToFixed } from '~/helpers/utils/time'
import { useWorklogsStore } from '~/store/worklogs'

export const useMonthlyReportStore = defineStore('monthly-report', () => {
	const worklogsStore = useWorklogsStore('month', 'monthly-report')

	const { params, worklogsModel, isLoading } = storeToRefs(worklogsStore)

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

	watchEffect(() => {
		if (!isLoading.value && worklogsModel.value.length) {
			calcMonthStats()
		}
	})

	const calcMonthStats = () => {
		clearState()
		const fromDateTime = DateTime.fromISO(params.value.from);
		const toDateTime = DateTime.fromISO(params.value.to);

		let iterateDay = fromDateTime;

		const labels = [];
		const data = [];

		while (iterateDay <= toDateTime && iterateDay.hasSame(fromDateTime, 'month')) {
			const dayItems = worklogsModel.value.filter((item: Yandex.Worklog) =>
				DateTime.fromISO(item.start).hasSame(iterateDay, 'day')
			);

			labels.push(iterateDay.toFormat('dd'));
			data.push(formatHoursToFixed(calculateTotalHours(dayItems)));

			iterateDay = iterateDay.plus({ day: 1 });
		}

		monthChartData.value.labels = labels;
		monthChartData.value.datasets[0].data = data;
	};

	const clearState = () => {
		monthChartData.value.labels = [];
		monthChartData.value.datasets[0].data = [];
	}

	const averageHoursByMonth = computed(() => {
		let count = 0
		const total = monthChartData.value.datasets[0].data.reduce((acc, item) => {
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
		monthChartData,
		refresh: worklogsStore.refresh,
		averageHoursByMonth
	}
})
