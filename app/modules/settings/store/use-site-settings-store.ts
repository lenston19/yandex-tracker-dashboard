import { addDays, endOfMonth, isAfter, startOfDay, startOfMonth } from 'date-fns'
import { useNow } from '@vueuse/core'
import { isWorkingDay } from '~/core/composables/use-production-calendar'
import { useModal } from 'vue-final-modal'
import { DEFAULT_TIME_ZONE } from '../models/constants/time-zone'
import type { HeatmapWeeks, TimeZoneSelectOption } from '../types'
import type { ThemeType } from '~/core/types'

const YEAR = 60 * 60 * 24 * 30 * 12

export const useSiteSettingsStore = defineStore(
  'site-settings',
  () => {
    const themeType = ref<ThemeType>(useRuntimeConfig().public.themeType as ThemeType)
    const organizationId = useCookie('organizationId', { maxAge: YEAR })
    const accessToken = useCookie('accessToken', { maxAge: YEAR })

    const hoursInDay = ref<number>(8)
    const gold = ref<number>(0)
    const timeZone = ref<TimeZoneSelectOption>({ ...DEFAULT_TIME_ZONE })

    // Migration: old format stored IANA id in `value` field, current format uses `id`
    watchEffect(() => {
      const tz = timeZone.value as TimeZoneSelectOption & { value?: string }
      if (tz.id?.startsWith('(GMT') && tz.value) {
        timeZone.value = { label: tz.label, id: tz.value }
      }
    })
    const isNeedOrganizationId = computed(() => !organizationId.value)
    const isShowWeeklyLoading = ref<boolean>(false)

    const heatmap = reactive<{
      show: boolean
      weeks: HeatmapWeeks
    }>({
      show: true,
      weeks: 53
    })

    const isHaveThemeType = computed(() => {
      return !!themeType.value?.length
    })

    const seasonalTheme = reactive<{ type: ThemeType | undefined; active: boolean }>({
      type: themeType.value,
      active: isHaveThemeType.value
    })

    const clearState = () => {
      organizationId.value = ''
      accessToken.value = ''
    }

    const now = useNow()

    const needHoursInCurrentMonth = ref<number>(0)
    const remainingWorkdays = ref<number>(0)

    async function updateCalendarStats() {
      const today = now.value
      const monthEnd = endOfMonth(today)
      const todayStart = startOfDay(today)
      let totalWorkdays = 0
      let remaining = 0

      for (let d = startOfMonth(today); !isAfter(d, monthEnd); d = addDays(d, 1)) {
        if (await isWorkingDay(d)) {
          totalWorkdays++
          if (!isAfter(todayStart, d)) remaining++
        }
      }

      needHoursInCurrentMonth.value = totalWorkdays * hoursInDay.value
      remainingWorkdays.value = remaining
    }

    const currentDayKey = computed(() => now.value.toDateString())
    watch(currentDayKey, updateCalendarStats, { immediate: true })
    watch(hoursInDay, updateCalendarStats)

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
      remainingWorkdays,
      isShowWeeklyLoading,

      heatmap,

      seasonalTheme,
      themeType,
      isHaveThemeType,

      clearState,
      setTimeZone
    }
  },
  {
    persist: {
      omit: ['accessToken', 'organizationId', 'seasonalTheme', 'themeType']
    }
  }
)
