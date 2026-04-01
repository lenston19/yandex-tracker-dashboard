import { describe, it, expect } from 'vitest'
import { useMonthlyReportStore } from '../../app/modules/monthly-report/store/use-monthly-report-store'

describe('averageHoursByMonth', () => {
  it('пустой массив данных → 0', () => {
    const store = useMonthlyReportStore()
    store.monthLineChartData.datasets[0]!.data = []
    expect(store.averageHoursByMonth).toBe(0)
  })

  it('все значения = 0 → 0 (защита от деления на ноль)', () => {
    const store = useMonthlyReportStore()
    store.monthLineChartData.datasets[0]!.data = [0, 0, 0]
    expect(store.averageHoursByMonth).toBe(0)
  })

  it('все значения < 0.25 (порог) → 0', () => {
    const store = useMonthlyReportStore()
    store.monthLineChartData.datasets[0]!.data = [0.1, 0.2, 0.05]
    expect(store.averageHoursByMonth).toBe(0)
  })

  it('значение ровно 0.25 исключается (строгое >)', () => {
    const store = useMonthlyReportStore()
    store.monthLineChartData.datasets[0]!.data = [0.25, 0.25, 0.25]
    expect(store.averageHoursByMonth).toBe(0)
  })

  it('смешанные значения: усредняет только те, что > 0.25', () => {
    const store = useMonthlyReportStore()
    // [1.5, 0.1, 2.5, 0.0, 3.0] → учитываются [1.5, 2.5, 3.0], среднее = 7/3 = 2.33
    store.monthLineChartData.datasets[0]!.data = [1.5, 0.1, 2.5, 0.0, 3.0]
    expect(store.averageHoursByMonth).toBe(2.33)
  })

  it('один день > 0.25 → возвращает его значение', () => {
    const store = useMonthlyReportStore()
    store.monthLineChartData.datasets[0]!.data = [0, 0, 5.0, 0]
    expect(store.averageHoursByMonth).toBe(5.0)
  })

  it('результат округлён до 2 знаков после запятой', () => {
    const store = useMonthlyReportStore()
    // [1, 2] → среднее = 1.5 (ровно)
    store.monthLineChartData.datasets[0]!.data = [1, 2]
    expect(store.averageHoursByMonth).toBe(1.5)
    // [1, 1, 2] → среднее = 1.333... → 1.33
    store.monthLineChartData.datasets[0]!.data = [1, 1, 2]
    expect(store.averageHoursByMonth).toBe(1.33)
  })
})
