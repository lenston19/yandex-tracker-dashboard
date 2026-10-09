import { describe, expect, it } from 'vitest'
import { getHoursProgressColor } from '../../app/core/utils/progress-color'

describe('getHoursProgressColor', () => {
  it('меньше 2 часов — error', () => {
    expect(getHoursProgressColor(1, 8)).toBe('error')
  })

  it('от 2 часов и до нормы — warning', () => {
    expect(getHoursProgressColor(5, 8)).toBe('warning')
  })

  it('норма выполнена или превышена — success', () => {
    expect(getHoursProgressColor(8, 8)).toBe('success')
    expect(getHoursProgressColor(10, 8)).toBe('success')
  })

  it('нет часов и не выходной — success', () => {
    expect(getHoursProgressColor(0, 8)).toBe('success')
  })

  it('выходной без часов — neutral', () => {
    expect(getHoursProgressColor(0, 8, true)).toBe('neutral')
  })

  it('выходной с часами — info', () => {
    expect(getHoursProgressColor(3, 8, true)).toBe('info')
  })
})
