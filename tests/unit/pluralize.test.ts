import { describe, it, expect } from 'vitest'
import { pluralize } from '../../app/core/utils/pluralize'

const words = ['час', 'часа', 'часов', 'ч.']

describe('pluralize', () => {
  it('1 → час', () => {
    expect(pluralize(1, words)).toBe('1 час')
  })

  it('2 → часа', () => {
    expect(pluralize(2, words)).toBe('2 часа')
  })

  it('3 → часа', () => {
    expect(pluralize(3, words)).toBe('3 часа')
  })

  it('4 → часа', () => {
    expect(pluralize(4, words)).toBe('4 часа')
  })

  it('5 → часов', () => {
    expect(pluralize(5, words)).toBe('5 часов')
  })

  it('11 → часов (исключение 11-19)', () => {
    expect(pluralize(11, words)).toBe('11 часов')
  })

  it('12 → часов (исключение 11-19)', () => {
    expect(pluralize(12, words)).toBe('12 часов')
  })

  it('14 → часов (исключение 11-19)', () => {
    expect(pluralize(14, words)).toBe('14 часов')
  })

  it('21 → час', () => {
    expect(pluralize(21, words)).toBe('21 час')
  })

  it('22 → часа', () => {
    expect(pluralize(22, words)).toBe('22 часа')
  })

  it('25 → часов', () => {
    expect(pluralize(25, words)).toBe('25 часов')
  })

  it('100 → часов', () => {
    expect(pluralize(100, words)).toBe('100 часов')
  })

  it('0 → часов', () => {
    expect(pluralize(0, words)).toBe('0 часов')
  })

  it('нецелое число → последнее слово (сокращение)', () => {
    expect(pluralize(0.5, words)).toBe('0.5 ч.')
    expect(pluralize(1.5, words)).toBe('1.5 ч.')
    expect(pluralize(2.25, words)).toBe('2.25 ч.')
  })

  it('отрицательные числа: -1 → час', () => {
    expect(pluralize(-1, words)).toBe('-1 час')
  })

  it('отрицательные числа: -5 → часов', () => {
    expect(pluralize(-5, words)).toBe('-5 часов')
  })

  it('отрицательные числа: -11 → часов', () => {
    expect(pluralize(-11, words)).toBe('-11 часов')
  })

  it('отрицательные числа: -21 → час', () => {
    expect(pluralize(-21, words)).toBe('-21 час')
  })
})
