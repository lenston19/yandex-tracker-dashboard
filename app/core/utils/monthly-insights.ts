export interface QueueAccuracyInput {
  queueKey: string
  queueName: string
  isOverEstimated: boolean
}

export interface QueueAccuracyStat {
  queueKey: string
  queueName: string
  total: number
  percent: number
}

export function calcAccuracyByQueue(items: QueueAccuracyInput[]): QueueAccuracyStat[] {
  const map = new Map<string, { queueName: string; total: number; over: number }>()

  items.forEach(item => {
    const entry = map.get(item.queueKey) ?? { queueName: item.queueName, total: 0, over: 0 }
    entry.total += 1
    if (item.isOverEstimated) entry.over += 1
    map.set(item.queueKey, entry)
  })

  return Array.from(map.entries())
    .map(([queueKey, { queueName, total, over }]) => ({
      queueKey,
      queueName,
      total,
      percent: Math.round(((total - over) / total) * 100)
    }))
    .sort((a, b) => a.percent - b.percent)
}
