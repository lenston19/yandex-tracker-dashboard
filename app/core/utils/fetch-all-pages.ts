export async function fetchAllPages<T>(
  fetchPage: (page: string) => Promise<{ status: number; _data?: T[] }>,
  totalPages: number
): Promise<T[]> {
  const pages = Array.from({ length: totalPages - 1 }, (_, i) => String(i + 2))
  const responses = await Promise.all(pages.map(page => fetchPage(page)))
  return responses.filter(res => res.status === 200 && res._data).flatMap(res => res._data!)
}
