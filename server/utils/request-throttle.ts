const MAX_CONCURRENT_PER_KEY = 3

interface QueueState {
  active: number
  queue: Array<() => void>
}

const queues = new Map<string, QueueState>()

export function runThrottled<T>(key: string, task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const state = queues.get(key) ?? { active: 0, queue: [] }
    queues.set(key, state)

    const run = () => {
      state.active++
      task()
        .then(resolve, reject)
        .finally(() => {
          state.active--
          const next = state.queue.shift()
          if (next) next()
          else if (state.active === 0) queues.delete(key)
        })
    }

    if (state.active < MAX_CONCURRENT_PER_KEY) run()
    else state.queue.push(run)
  })
}
