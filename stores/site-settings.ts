import { DateTime } from 'luxon'

export const useSiteSettingsStore = defineStore('site-settings', () => {
	const organizationId = ref<string>('')
	const accessToken = ref<string>('')

	const hoursInDay = ref<number>(8)
	const gold = ref<number>(0)

	const isNeedOrganizationId = computed(() => organizationId.value === '')

	const setOrganizationId = (id: string) => {
		organizationId.value = id
	}

	const setAccessToken = (token: string) => {
		accessToken.value = token
	}

	const clearState = () => {
		organizationId.value = ''
		accessToken.value = ''
	}

	const needHoursInCurrentMonth = computed(() => {
		const now = DateTime.now()
		const startOfMonth = now.startOf('month')

		let weekdaysCount = 0

		for (let date = startOfMonth; date <= now; date = date.plus({ days: 1 })) {
			if (date.weekday !== 6 && date.weekday !== 7) {
				weekdaysCount++
			}
		}

		return weekdaysCount * hoursInDay.value
	})

	return {
		organizationId,
		accessToken,
		hoursInDay,
		gold,
		needHoursInCurrentMonth,
		isNeedOrganizationId,
		setOrganizationId,
		setAccessToken,
		clearState
	}
},
	{
		persist: true,
	})
