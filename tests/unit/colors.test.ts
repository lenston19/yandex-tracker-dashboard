import { describe, it, expect } from 'vitest'
import { pickMeterColors, createPastelColorPicker } from '../../app/core/utils/colors'
import { PASTEL_COLORS } from '../../app/core/constants/pastel-colors'

describe('pickMeterColors', () => {
  it('count = 1 → возвращает 1 цвет', () => {
    const result = pickMeterColors(1)
    expect(result).toHaveLength(1)
    expect(PASTEL_COLORS).toContain(result[0])
  })

  it('count = 22 → возвращает все 22 цвета по порядку без дубликатов', () => {
    const result = pickMeterColors(22)
    expect(result).toHaveLength(22)
    expect(new Set(result).size).toBe(22)
    // step = floor(22/22) = 1, индексы 0..21 — все цвета в оригинальном порядке
    expect(result).toEqual(PASTEL_COLORS)
  })

  it('count = 0 → пустой массив (цикл не запускается)', () => {
    // step = floor(22/0) = Infinity, но 0 итераций (0 < 0 = false)
    expect(pickMeterColors(0)).toEqual([])
  })

  it('count = 23 → все 23 элемента одинаковы (step = 0, все индексы = 0)', () => {
    // step = floor(22/23) = 0, index = (i*0) % 22 = 0 для всех i
    const result = pickMeterColors(23)
    expect(result).toHaveLength(23)
    expect(new Set(result).size).toBe(1)
    expect(result[0]).toBe(PASTEL_COLORS[0])
  })

  it('count = 11 → чётные индексы через шаг 2', () => {
    // step = floor(22/11) = 2, индексы 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
    const result = pickMeterColors(11)
    expect(result).toHaveLength(11)
    expect(new Set(result).size).toBe(11) // нет дубликатов
    expect(result[0]).toBe(PASTEL_COLORS[0])
    expect(result[1]).toBe(PASTEL_COLORS[2])
    expect(result[2]).toBe(PASTEL_COLORS[4])
  })

  it('все возвращённые цвета присутствуют в палитре', () => {
    const result = pickMeterColors(5)
    result.forEach(color => expect(PASTEL_COLORS).toContain(color))
  })
})

describe('createPastelColorPicker', () => {
  it('первый getNextColor() возвращает первый цвет палитры', () => {
    const picker = createPastelColorPicker()
    expect(picker.getNextColor()).toBe(PASTEL_COLORS[0])
  })

  it('последовательные вызовы возвращают разные цвета', () => {
    const picker = createPastelColorPicker()
    const colors = [picker.getNextColor(), picker.getNextColor(), picker.getNextColor()]
    expect(new Set(colors).size).toBe(3)
  })

  it('после исчерпания всех 22 цветов бросает ошибку', () => {
    const picker = createPastelColorPicker()
    // Исчерпать все цвета
    for (let i = 0; i < PASTEL_COLORS.length; i++) {
      picker.getNextColor()
    }
    expect(() => picker.getNextColor()).toThrow('Все цвета использованы')
  })

  it('resetpastelColors() сбрасывает состояние — цвета снова доступны с начала', () => {
    const picker = createPastelColorPicker()
    const firstColor = picker.getNextColor()
    picker.getNextColor()
    picker.resetpastelColors()
    // После сброса первый цвет снова первый
    expect(picker.getNextColor()).toBe(firstColor)
  })

  it('два экземпляра picker независимы', () => {
    const picker1 = createPastelColorPicker()
    const picker2 = createPastelColorPicker()
    picker1.getNextColor()
    // picker2 не затронут picker1
    expect(picker2.getNextColor()).toBe(PASTEL_COLORS[0])
  })
})
