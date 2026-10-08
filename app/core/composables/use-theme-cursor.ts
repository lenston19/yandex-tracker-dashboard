import type { Ref } from 'vue'

export function useThemeCursor(enabled: Ref<boolean>, className: string) {
  watch(enabled, value => document.documentElement.classList.toggle(className, value), { immediate: true })

  onUnmounted(() => {
    document.documentElement.classList.remove(className)
  })
}
