import { describe, it, expect, vi } from 'vitest'
import { fetchAllPages } from '../../app/core/utils/fetch-all-pages'

const makePage = (data: string[], status = 200) => ({ status, _data: data })

describe('fetchAllPages', () => {
  it('totalPages = 1 → не делает ни одного запроса, возвращает []', async () => {
    const fetchPage = vi.fn()
    const result = await fetchAllPages(fetchPage, 1)
    expect(fetchPage).not.toHaveBeenCalled()
    expect(result).toEqual([])
  })

  it('totalPages = 2 → запрашивает только страницу 2', async () => {
    const fetchPage = vi.fn().mockResolvedValue(makePage(['a', 'b']))
    const result = await fetchAllPages(fetchPage, 2)
    expect(fetchPage).toHaveBeenCalledOnce()
    expect(fetchPage).toHaveBeenCalledWith('2')
    expect(result).toEqual(['a', 'b'])
  })

  it('totalPages = 4 → запрашивает страницы 2, 3, 4 и объединяет результаты', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(makePage(['page2-item']))
      .mockResolvedValueOnce(makePage(['page3-item']))
      .mockResolvedValueOnce(makePage(['page4-item']))

    const result = await fetchAllPages(fetchPage, 4)
    expect(fetchPage).toHaveBeenCalledTimes(3)
    expect(result).toEqual(['page2-item', 'page3-item', 'page4-item'])
  })

  it('страница со status !== 200 → пропускается', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(makePage(['ok']))
      .mockResolvedValueOnce({ status: 404, _data: ['should-be-ignored'] })
      .mockResolvedValueOnce(makePage(['also-ok']))

    const result = await fetchAllPages(fetchPage, 4)
    expect(result).toEqual(['ok', 'also-ok'])
  })

  it('страница без поля _data → пропускается', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(makePage(['ok']))
      .mockResolvedValueOnce({ status: 200 }) // нет _data

    const result = await fetchAllPages(fetchPage, 3)
    expect(result).toEqual(['ok'])
  })

  it('порядок страниц в результате сохраняется', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce(makePage(['second']))
      .mockResolvedValueOnce(makePage(['third']))

    const result = await fetchAllPages(fetchPage, 3)
    expect(result).toEqual(['second', 'third'])
  })

  it('работает с обобщёнными типами (number)', async () => {
    const fetchPage = vi.fn().mockResolvedValue({ status: 200, _data: [1, 2, 3] })
    const result = await fetchAllPages<number>(fetchPage, 2)
    expect(result).toEqual([1, 2, 3])
  })
})
