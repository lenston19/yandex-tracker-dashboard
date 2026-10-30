// Совпадает с MAX_CONCURRENT_PER_KEY на сервере (server/utils/request-throttle.ts) — без этого
// ограничения Promise.all открыл бы все страницы разом, а сервер всё равно очередит их по 3.
const CONCURRENCY = 3

// $api.raw реджектит промис на non-2xx (ofetch бросает FetchError, а не резолвит {status}).
// Одна страница с транзиентным 429 валила весь Promise.all батча и теряла уже полученные
// страницы — ретраим такую страницу отдельно, не трогая соседей по батчу.
const MAX_RETRIES = 2
const RETRY_DELAY_MS = 500

function getStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined
  const err = error as { statusCode?: number; response?: { status?: number } }
  return err.statusCode ?? err.response?.status
}

async function fetchPageWithRetry<T>(
  fetchPage: (page: string) => Promise<{ status: number; _data?: T[] }>,
  page: string
): Promise<{ status: number; _data?: T[] }> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetchPage(page)
    } catch (error) {
      if (attempt >= MAX_RETRIES || getStatus(error) !== 429) throw error
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)))
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
    const responses = await Promise.all(batch.map(page => fetchPageWithRetry(fetchPage, page)))
    responses.forEach(res => {
      if (res.status === 200 && res._data) results.push(...res._data)
    })
  }

  return results
}
