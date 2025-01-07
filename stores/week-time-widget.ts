import { DateTime } from 'luxon'
import { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { calculateTotalHours, formatHoursToFixed } from '~/helpers/utils/time'
import DayInfoModal from '~/components/widgets/modals/DayInfoModal.vue'
import { useWorklogsStore } from '~/stores/worklogs'

export interface Weekday {
	weekday: string
	monthDay: string
	hours: number
	items: Yandex.Worklog[]
}

export const useWeekTimeWidgetStore = defineStore('week-time-widget', () => {
	const worklogsStore = useWorklogsStore('week', 'week-time-widget')
	const { worklogsModel, isLoading, params } = storeToRefs(worklogsStore)

	const currentWeek = ref<Weekday[]>([])
	const weekTotalHours = ref<number>(0)

	const calcWeekStats = () => {
		clearState()
		let iterateDay = DateTime.fromISO(params.value.from)
		while (iterateDay.hasSame(DateTime.fromISO(params.value.from), 'week')) {
			const dayItems = worklogsModel.value.filter((item: Yandex.Worklog) =>
				DateTime.fromISO(item.start).hasSame(iterateDay, 'day')
			)
			const dayHours = formatHoursToFixed(calculateTotalHours(dayItems))
			weekTotalHours.value = weekTotalHours.value + dayHours

			currentWeek.value.push({
				weekday: iterateDay.toFormat('EEEE'),
				monthDay: iterateDay.toFormat('dd MMMM yyyy'),
				hours: dayHours,
				items: dayItems,
			})
			iterateDay = iterateDay.plus({ day: 1 })
		}
	}

	const clearState = () => {
		currentWeek.value = []
		weekTotalHours.value = 0
	}

	watchEffect(() => {
		if (!isLoading.value) {
			calcWeekStats()
		}
	})

	const modal = useModal()

	function openDetailDayDialog (day: Weekday) {
		modal.open(DayInfoModal, { day })
	}

	return {
		params,
		next: worklogsStore.next,
		prev: worklogsStore.prev,
		weekTotalHours,
		currentWeek,
		isLoading,
		refresh: worklogsStore.refresh,
		openDetailDayDialog,
	}
})
