import { DEFAULT_TIME_ZONE } from '../models/constants/time-zone'
import type { TimeZoneSelectOption } from '../types'

export function useTimezoneSettings() {
  const timeZone = ref<TimeZoneSelectOption>({ ...DEFAULT_TIME_ZONE })

  // Migration: old format stored IANA id in `value` field, current format uses `id`
  watchEffect(() => {
    const tz = timeZone.value as TimeZoneSelectOption & { value?: string }
    if (tz.id?.startsWith('(GMT') && tz.value) {
      timeZone.value = { label: tz.label, id: tz.value }
    }
  })

  const toast = useToast()
  watch(timeZone, (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      toast.add({ title: 'Временная зона изменена', description: timeZone.value.label })
    }
  })

  function setTimeZone(newTimeZone: TimeZoneSelectOption) {
    timeZone.value = { ...newTimeZone }
  }

  return {
    timeZone,
    setTimeZone
  }
}
