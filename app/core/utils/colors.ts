import { PASTEL_COLORS } from '../constants/pastel-colors'

export function pickMeterColors(count: number): string[] {
  const step = Math.floor(PASTEL_COLORS.length / count)
  const result: string[] = []

  for (let i = 0; i < count; i++) {
    const index = (i * step) % PASTEL_COLORS.length
    if (PASTEL_COLORS[index]) {
      result.push(PASTEL_COLORS[index])
    }
  }

  return result
}

export function createPastelColorPicker() {
  const usedPastelColors = new Set<string>()

  return {
    getNextColor: (): string => {
      for (const color of PASTEL_COLORS) {
        if (!usedPastelColors.has(color)) {
          usedPastelColors.add(color)
          return color
        }
      }
      throw new Error('Все цвета использованы')
    },
    resetpastelColors: (): void => {
      usedPastelColors.clear()
    }
  }
}
