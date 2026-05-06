import { useCredentialsSettings } from '../composables/use-credentials-settings'
import { useWorkTimeSettings } from '../composables/use-work-time-settings'
import { useDisplaySettings } from '../composables/use-display-settings'
import { useTimezoneSettings } from '../composables/use-timezone-settings'
import { useThemeSettings } from '../composables/use-theme-settings'

export type SiteSettingsStore = ReturnType<typeof useSiteSettingsStore>

export const useSiteSettingsStore = defineStore(
  'site-settings',
  () => {
    return {
      ...useCredentialsSettings(),
      ...useWorkTimeSettings(),
      ...useDisplaySettings(),
      ...useTimezoneSettings(),
      ...useThemeSettings()
    }
  },
  {
    persist: {
      omit: ['accessToken', 'organizationId', 'seasonalTheme', 'themeType']
    }
  }
)
