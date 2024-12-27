import { defineStore, storeToRefs } from 'pinia'
import { calculateTotalHours, formatHoursToFixed } from '~/helpers/utils/time'
import { useWorklogsStore } from '~/store/worklogs'

export const useDayTimeWidgetStore = defineStore('day-time-widget', () => {
	const worklogsStore = useWorklogsStore('day', 'day-time-widget')
	const { worklogsModel, isLoading } = storeToRefs(worklogsStore)

	const totalHours = computed(() => {
		if (!worklogsModel.value) {
			return
		}
		return formatHoursToFixed(calculateTotalHours(worklogsModel.value))
	})

	return {
		isLoading,
		totalHours,
		refresh: worklogsStore.refresh,
	}
})
