import { describe, it, expect } from 'vitest'
import { buildIssueSearchQuery } from '../../app/core/utils/issue-search'

describe('buildIssueSearchQuery', () => {
  describe('поиск по ключу задачи', () => {
    it('точный ключ — Key: с кавычками', () => {
      expect(buildIssueSearchQuery('HZ-230')).toBe('Key: "HZ-230"')
    })

    it('ключ в нижнем регистре', () => {
      expect(buildIssueSearchQuery('hz-230')).toBe('Key: "hz-230"')
    })

    it('обрезает пробелы вокруг ключа', () => {
      expect(buildIssueSearchQuery('  HZ-230  ')).toBe('Key: "HZ-230"')
    })

    it('ключ с статусом', () => {
      expect(buildIssueSearchQuery('HZ-230', undefined, ['inProgress'])).toBe('Key: "HZ-230" Status: inProgress')
    })

    it('не считает HZ- без числа ключом', () => {
      expect(buildIssueSearchQuery('HZ-')).toContain('Summary: "HZ-"')
    })

    it('не считает текст с дефисом ключом', () => {
      expect(buildIssueSearchQuery('какой-то текст')).toContain('Summary: "какой-то текст"')
    })
  })

  describe('текстовый поиск по summary', () => {
    it('без login — только Summary', () => {
      expect(buildIssueSearchQuery('Авторизация')).toBe('Summary: "Авторизация"')
    })

    it('с login — добавляет Assignee', () => {
      expect(buildIssueSearchQuery('Авторизация', 'lenston')).toBe('Assignee: lenston Summary: "Авторизация"')
    })

    it('добавляет фильтр статуса если передан', () => {
      expect(buildIssueSearchQuery('авторизация', 'lenston', ['open', 'inProgress'])).toBe(
        'Assignee: lenston Summary: "авторизация" Status: open, inProgress'
      )
    })

    it('не добавляет Status если statuses пустой массив', () => {
      expect(buildIssueSearchQuery('текст', undefined, [])).not.toContain('Status:')
    })

    it('не добавляет Status если statuses не передан', () => {
      expect(buildIssueSearchQuery('текст')).not.toContain('Status:')
    })

    it('экранирует кавычки в поисковом запросе', () => {
      expect(buildIssueSearchQuery('он сказал "да"')).toContain('Summary: "он сказал \\"да\\""')
    })
  })
})
