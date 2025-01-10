import { DateTime } from 'luxon'
import SettingsOrganizationIdModal from '~/components/settings/modals/SettingsOrganizationIdModal.vue'
import { DEFAULT_TIME_ZONE } from '~/helpers/static/timeZone'
import { TimeZoneSelectOption } from '~/types/base'

export const useSiteSettingsStore = defineStore(
	'site-settings',
	() => {
		const organizationId = ref<string>('')
		const accessToken = ref<string>('')

		const hoursInDay = ref<number>(8)
		const gold = ref<number>(0)
		const timeZone = ref<TimeZoneSelectOption>({ ...DEFAULT_TIME_ZONE })
		const isNeedOrganizationId = computed(() => organizationId.value === '')

		const clearState = () => {
			organizationId.value = ''
			accessToken.value = ''
		}

		const needHoursInCurrentMonth = computed(() => {
			const now = DateTime.now()

			let weekdaysCount = 0

			for (let date = now.startOf('month'); date <= now.endOf('month'); date = date.plus({ days: 1 })) {
				if (date.weekday !== 6 && date.weekday !== 7) {
					weekdaysCount++
				}
			}

			return weekdaysCount * hoursInDay.value
		})

		const modal = useModal()

		watchEffect(() => {
			if (isNeedOrganizationId.value) {
				modal.open(SettingsOrganizationIdModal)
			} else {
				modal.close()
			}
		})

		const toast = useToast()

		watch(timeZone, () => {
			toast.add({
				title: 'Временная зона изменена',
				description: timeZone.value.id
			})
		})

		function setTimeZone(newTimeZone: TimeZoneSelectOption) {
			timeZone.value = {
				id: newTimeZone.id,
				value: newTimeZone.value
			}
		}

		return {
			organizationId,
			accessToken,
			hoursInDay,
			gold,
			timeZone,
			needHoursInCurrentMonth,
			clearState,
			setTimeZone
		}
	},
	{
		persist: true
	}
)
