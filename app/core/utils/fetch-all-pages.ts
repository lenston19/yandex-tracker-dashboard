// Совпадает с MAX_CONCURRENT_PER_KEY на сервере (server/utils/request-throttle.ts) — Tracker
// ограничивает частоту запросов, а не только конкуренцию.
const CONCURRENCY = 1
const MAX_RETRIES = 2

export function getStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const err = error as { status?: number; statusCode?: number; response?: { status?: number } }
  return err.status ?? err.statusCode ?? err.response?.status
}

export async function retryOn429<T>(fn: () => Promise<T>, retries: number, delayMs = 1000): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt >= retries || getStatus(error) !== 429) throw error
      await new Promise(resolve => setTimeout(resolve, delayMs * 2 ** attempt))
    }
  }
}

export async function fetchAllPages<T>(
  fetchPage: (page: string) => Promise<{ status: number; _data?: T[] }>,
  totalPages: number
): Promise<T[]> {
  const pages = Array.from({ length: totalPages - 1 }, (_, i) => String(i + 2))
  const results: T[] = []

  for (let i = 0; i < pages.length; i += CONCURRENCY) {
    const batch = pages.slice(i, i + CONCURRENCY)
    // Ретраим страницу отдельно, не трогая соседей по батчу — иначе транзиентный 429 на одной
    // странице валит весь Promise.all и теряет уже полученные страницы.
    const responses = await Promise.all(batch.map(page => retryOn429(() => fetchPage(page), MAX_RETRIES)))
    responses.forEach(res => {
      if (res.status === 200 && res._data) results.push(...res._data)
    })
  }

  return results
}
