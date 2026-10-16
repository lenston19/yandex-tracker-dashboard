// Совпадает с MAX_CONCURRENT_PER_KEY на сервере (server/utils/request-throttle.ts) — без этого
// ограничения Promise.all открыл бы все страницы разом, а сервер всё равно очередит их по 3.
const CONCURRENCY = 3

export async function fetchAllPages<T>(
  fetchPage: (page: string) => Promise<{ status: number; _data?: T[] }>,
  totalPages: number
): Promise<T[]> {
  const pages = Array.from({ length: totalPages - 1 }, (_, i) => String(i + 2))
  const results: T[] = []

  for (let i = 0; i < pages.length; i += CONCURRENCY) {
    const batch = pages.slice(i, i + CONCURRENCY)
    const responses = await Promise.all(batch.map(page => fetchPage(page)))
    responses.forEach(res => {
      if (res.status === 200 && res._data) results.push(...res._data)
    })
  }

  return results
}
