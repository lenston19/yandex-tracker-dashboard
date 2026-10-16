const inFlight = new Map<string, Promise<unknown>>()

/**
 * Схлопывает одновременные вызовы с одинаковым ключом в один промис.
 * Не кэширует по времени — ключ освобождается сразу после резолва/реджекта,
 * следующий вызов с тем же ключом всегда идёт заново.
 */
export function dedupeRequest<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key)
  if (existing) return existing as Promise<T>

  const promise = fn().finally(() => inFlight.delete(key))
  inFlight.set(key, promise)
  return promise
}
