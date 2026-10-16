import { describe, it, expect, vi } from 'vitest'
import { dedupeRequest } from '../../app/core/utils/request-dedupe'

describe('dedupeRequest', () => {
  it('два параллельных вызова с одним ключом → fn вызван один раз, оба получают один результат', async () => {
    const fn = vi.fn().mockResolvedValue('result')

    const [a, b] = await Promise.all([dedupeRequest('key', fn), dedupeRequest('key', fn)])

    expect(fn).toHaveBeenCalledOnce()
    expect(a).toBe('result')
    expect(b).toBe('result')
  })

  it('после резолва ключ освобождается — следующий вызов с тем же ключом вызывает fn заново', async () => {
    const fn = vi.fn().mockResolvedValueOnce('first').mockResolvedValueOnce('second')

    const first = await dedupeRequest('key-2', fn)
    const second = await dedupeRequest('key-2', fn)

    expect(fn).toHaveBeenCalledTimes(2)
    expect(first).toBe('first')
    expect(second).toBe('second')
  })

  it('разные ключи никогда не схлопываются', async () => {
    const fnA = vi.fn().mockResolvedValue('a')
    const fnB = vi.fn().mockResolvedValue('b')

    const [a, b] = await Promise.all([dedupeRequest('key-a', fnA), dedupeRequest('key-b', fnB)])

    expect(fnA).toHaveBeenCalledOnce()
    expect(fnB).toHaveBeenCalledOnce()
    expect(a).toBe('a')
    expect(b).toBe('b')
  })

  it('ключ освобождается и после ошибки — следующий вызов не переиспользует отклонённый промис', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce('ok')

    await expect(dedupeRequest('key-3', fn)).rejects.toThrow('fail')
    const result = await dedupeRequest('key-3', fn)

    expect(fn).toHaveBeenCalledTimes(2)
    expect(result).toBe('ok')
  })
})
