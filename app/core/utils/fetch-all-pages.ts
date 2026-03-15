export async function fetchAllPages<T>(
  fetchPage: (page: string) => Promise<{ status: number; _data?: T[] }>,
  totalPages: number
): Promise<T[]> {
  const results: T[] = []
  for (let page = 2; page <= totalPages; page++) {
    const res = await fetchPage(String(page))
    if (res.status === 200 && res._data) {
      results.push(...res._data)
    }
  }
  return results
}
