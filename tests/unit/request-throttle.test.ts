import { describe, expect, it } from 'vitest'
import { runThrottled } from '../../server/utils/request-throttle'

function deferred<T = undefined>() {
  let resolve!: (value?: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T | undefined>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('runThrottled', () => {
  it('запускает не более лимита задач одновременно для одного ключа', async () => {
    const MAX_CONCURRENT = 3
    let active = 0
    let maxActive = 0

    const tasks = Array.from({ length: 10 }, () =>
      runThrottled('token-a', async () => {
        active++
        maxActive = Math.max(maxActive, active)
        await new Promise(r => setTimeout(r, 5))
        active--
        return true
      })
    )

    await Promise.all(tasks)

    expect(maxActive).toBeLessThanOrEqual(MAX_CONCURRENT)
  })

  it('запускает задачи сверх лимита по мере освобождения слотов (FIFO)', async () => {
    const order: number[] = []
    const deferreds = Array.from({ length: 5 }, () => deferred())

    const tasks = deferreds.map((d, i) =>
      runThrottled('token-b', async () => {
        order.push(i)
        await d.promise
      })
    )

    await new Promise(r => setTimeout(r, 0))

    expect(order).toEqual([0, 1, 2])

    deferreds[0].resolve()
    await new Promise(r => setTimeout(r, 0))
    expect(order).toEqual([0, 1, 2, 3])

    deferreds[1].resolve()
    await new Promise(r => setTimeout(r, 0))
    expect(order).toEqual([0, 1, 2, 3, 4])

    deferreds[2].resolve()
    deferreds[3].resolve()
    deferreds[4].resolve()
    await Promise.all(tasks)
  })

  it('не блокирует разные ключи друг другом', async () => {
    const order: string[] = []
    const dA = deferred()

    const taskA = runThrottled('key-a', async () => {
      order.push('a-start')
      await dA.promise
      order.push('a-end')
    })

    const taskB = runThrottled('key-b', async () => {
      order.push('b-start')
      order.push('b-end')
    })

    await taskB
    dA.resolve()
    await taskA

    expect(order).toEqual(['a-start', 'b-start', 'b-end', 'a-end'])
  })

  it('отклонение одной задачи не блокирует остальные в очереди', async () => {
    const results: string[] = []

    const failing = runThrottled('key-c', async () => {
      throw new Error('boom')
    }).catch(() => {
      results.push('failed')
    })

    const succeeding = runThrottled('key-c', async () => {
      results.push('succeeded')
    })

    await Promise.all([failing, succeeding])

    expect(results).toContain('failed')
    expect(results).toContain('succeeded')
  })
})
