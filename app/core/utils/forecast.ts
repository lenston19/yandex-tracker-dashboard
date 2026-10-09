export function calcForecastHours(
  totalHoursSoFar: number,
  workedDaysSoFar: number,
  remainingWorkdays: number
): number | null {
  if (workedDaysSoFar <= 0) return null
  const avgPerDay = totalHoursSoFar / workedDaysSoFar
  return +(totalHoursSoFar + avgPerDay * remainingWorkdays).toFixed(1)
}
