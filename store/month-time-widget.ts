import { defineStore, storeToRefs } from 'pinia'
import { calculateTotalHours, formatHoursToFixed } from '~/helpers/utils/time'
import { useWorklogsStore } from '~/store/worklogs'

export const useMonthTimeWidgetStore = defineStore('month-time-widget', () => {
	const worklogsStore = useWorklogsStore('month', 'month-time-widget')
	const { worklogsModel, isLoading } = storeToRefs(worklogsStore)

	const totalHours = computed(() => worklogsModel.value ? formatHoursToFixed(calculateTotalHours(worklogsModel.value)) : 0)

	return {
		totalHours,
		worklogsModel,
		isLoading,
		refresh: worklogsStore.refresh,
	}
})
