import { useWorklogsStore } from '~/stores/worklogs'

export const useMonthTimeWidgetStore = defineStore('month-time-widget', () => {
	const worklogsStore = useWorklogsStore('month', 'month-time-widget')
	const { worklogsModel, isLoading, totalHours } = storeToRefs(worklogsStore)

	return {
		totalHours,
		worklogsModel,
		isLoading,
		refresh: worklogsStore.refresh
	}
})
