import { useWindowSize } from '@vueuse/core'

/**
 * Количество декоративных элементов в зависимости от ширины экрана.
 * tiers — пары [maxWidth, count], проверяются по порядку; fallback — значение для остальных ширин.
 */
export function useResponsiveCount(tiers: [maxWidth: number, count: number][], fallback: number) {
  const { width } = useWindowSize()

  return computed(() => {
    for (const [maxWidth, count] of tiers) {
      if (width.value < maxWidth) return count
    }
    return fallback
  })
}
