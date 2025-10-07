import { DateTime } from 'luxon'
import { useModal } from 'vue-final-modal'
import { DEFAULT_TIME_ZONE } from '../constants/time-zone'
import type { TimeZoneSelectOption } from '../types'

export const useSiteSettingsStore = defineStore(
  'site-settings',
  () => {
    const organizationId = ref<string>('')
    const accessToken = ref<string>('')

    const hoursInDay = ref<number>(8)
    const gold = ref<number>(0)
    const timeZone = ref<TimeZoneSelectOption>({ ...DEFAULT_TIME_ZONE })
    const isNeedOrganizationId = computed(() => organizationId.value === '')
    const isShowWeeklyLoading = ref<boolean>(false)

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

    const { open, close } = useModal({
      component: defineAsyncComponent(() => import('../components/modals/settings-organization-id-modal.vue'))
    })

    watchEffect(() => {
      if (isNeedOrganizationId.value) {
        open()
      } else {
        close()
      }
    })

    const toast = useToast()

    watch(timeZone, (newVal, oldVal) => {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        toast.add({
          title: 'Временная зона изменена',
          description: timeZone.value.label
        })
      }
    })

    function setTimeZone(newTimeZone: TimeZoneSelectOption) {
      timeZone.value = { ...newTimeZone }
    }

    return {
      organizationId,
      accessToken,
      hoursInDay,
      gold,
      timeZone,
      needHoursInCurrentMonth,
      isShowWeeklyLoading,
      clearState,
      setTimeZone
    }
  },
  {
    persist: true
  }
)
