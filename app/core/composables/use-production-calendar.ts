import { getYear, getMonth, getDate, getDay } from 'date-fns'

// 0 = рабочий, 1 = выходной/праздник, 2 = сокращённый, 4 = нет данных
type DayStatus = '0' | '1' | '2' | '4'

const monthCache = new Map<string, Promise<string>>()

function fetchMonthData(year: number, month: number): Promise<string> {
  const key = `${year}-${month}`
  if (!monthCache.has(key)) {
    monthCache.set(
      key,
      fetch(`https://isdayoff.ru/api/getdata?year=${year}&month=${month}`)
        .then(r => r.text())
        .catch(() => '')
    )
  }
  return monthCache.get(key)!
}

function isoWorkingDay(date: Date): boolean {
  const dow = getDay(date)
  return dow !== 0 && dow !== 6
}

export async function isWorkingDay(date: Date): Promise<boolean> {
  const year = getYear(date)
  const month = getMonth(date) + 1
  const day = getDate(date)

  try {
    const data = await fetchMonthData(year, month)
    const status = data[day - 1] as DayStatus | undefined
    if (!status || status === '4') return isoWorkingDay(date)
    return status === '0' || status === '2'
  } catch {
    return isoWorkingDay(date)
  }
}
