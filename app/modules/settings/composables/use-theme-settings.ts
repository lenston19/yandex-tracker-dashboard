import type { ThemeEntities, ThemeType } from '~/core/types'
import { getActiveSeasonalThemeType } from '~/core/utils/seasonal-theme-window'

export function useThemeSettings() {
  const envThemeType = useRuntimeConfig().public.themeType as ThemeType
  const themeType = ref<ThemeType | undefined>(envThemeType || getActiveSeasonalThemeType())
  const isHaveThemeType = computed(() => !!themeType.value?.length)
  const seasonalTheme = reactive<{ type: ThemeType | undefined; active: boolean }>({
    type: themeType.value,
    active: isHaveThemeType.value
  })

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
    themeEntities
  }
}
