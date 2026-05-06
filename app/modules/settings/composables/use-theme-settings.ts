import type { ThemeType } from '~/core/types'

export function useThemeSettings() {
  const themeType = ref<ThemeType>(useRuntimeConfig().public.themeType as ThemeType)
  const isHaveThemeType = computed(() => !!themeType.value?.length)
  const seasonalTheme = reactive<{ type: ThemeType | undefined; active: boolean }>({
    type: themeType.value,
    active: isHaveThemeType.value
  })

  return {
    themeType,
    isHaveThemeType,
    seasonalTheme
  }
}
