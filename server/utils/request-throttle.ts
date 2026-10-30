const MAX_CONCURRENT_PER_KEY = 1
const MIN_START_INTERVAL_MS = 350

interface QueueState {
  active: number
  queue: Array<() => void>
  lastStartedAt: number
}

const queues = new Map<string, QueueState>()

export function runThrottled<T>(key: string, task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const state = queues.get(key) ?? { active: 0, queue: [], lastStartedAt: 0 }
    queues.set(key, state)

    const run = () => {
      // active++ здесь же, а не в setTimeout-колбэке — иначе синхронный всплеск вызовов
      // видит active === 0 у каждого из них и обходит лимит конкуренции до первого завершения.
      state.active++
      const now = Date.now()
      const plannedStart = Math.max(now, state.lastStartedAt + MIN_START_INTERVAL_MS)
      state.lastStartedAt = plannedStart

      setTimeout(() => {
        task()
          .then(resolve, reject)
          .finally(() => {
            state.active--
            const next = state.queue.shift()
            if (next) next()
            else if (state.active === 0) queues.delete(key)
          })
      }, plannedStart - now)
    }

    if (state.active < MAX_CONCURRENT_PER_KEY) run()
    else state.queue.push(run)
  })
}
