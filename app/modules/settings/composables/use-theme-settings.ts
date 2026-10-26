import type { ThemeEntities, ThemeType } from '~/core/types'
import { getActiveSeasonalThemeType } from '~/core/utils/seasonal-theme-window'

export function useThemeSettings() {
  const envThemeType = useRuntimeConfig().public.themeType as ThemeType
  const themeType = ref<ThemeType | undefined>(envThemeType || getActiveSeasonalThemeType())
  const isHaveThemeType = computed(() => !!themeType.value?.length)
  const seasonalThemeActive = ref<boolean>(isHaveThemeType.value)
  const seasonalTheme = computed(() => ({
    type: themeType.value,
    active: seasonalThemeActive.value
  }))

  const themeEntities = ref<ThemeEntities>({
    cursor: true,
    background: true,
    particles: true,
    celebrations: true
  })

  return {
    themeType,
    isHaveThemeType,
    seasonalTheme,
    seasonalThemeActive,
    themeEntities
  }
}
