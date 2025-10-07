const colors = [
  '#7F8C8D', // Серый
  '#1ABC9C', // Бирюзовый
  '#2ECC71', // Зеленый
  '#3498DB', // Голубой
  '#9B59B6', // Фиолетовый
  '#E67E22', // Оранжевый
  '#E74C3C', // Красный
  '#34495E', // Темно-синий
  '#F1C40F', // Желтый
  '#95A5A6', // Светло-серый
  '#16A085', // Морская волна
  '#27AE60', // Темно-зеленый
  '#2980B9', // Синий
  '#8E44AD', // Темно-фиолетовый
  '#D35400', // Темно-оранжевый
  '#C0392B', // Темно-красный
  '#BDC3C7', // Светло-серый
  '#7DCEA0', // Светло-зеленый
  '#73C6B6', // Светло-бирюзовый
  '#85C1E9' // Светло-голубой
]

export function pickMeterColors(count: number): string[] {
  const step = Math.floor(colors.length / count)
  const result: string[] = []

  for (let i = 0; i < count; i++) {
    const index = (i * step) % colors.length
    if (colors[index]) {
      result.push(colors[index])
    }
  }

  return result
}

export function createPastelColorPicker() {
  const usedColors = new Set<string>()

  return {
    getNextColor: (): string => {
      for (const color of colors) {
        if (!usedColors.has(color)) {
          usedColors.add(color)
          return color
        }
      }
      throw new Error('Все цвета использованы')
    },
    resetColors: (): void => {
      usedColors.clear()
    }
  }
}
