import { describe, it, expect } from 'vitest'
import { buildIssueSearchQuery } from '../../app/core/utils/issue-search'

describe('buildIssueSearchQuery', () => {
  describe('поиск по ключу задачи', () => {
    it('точный ключ — Key: с кавычками', () => {
      expect(buildIssueSearchQuery('user', 'HZ-230')).toBe('Key: "HZ-230"')
    })

    it('ключ в нижнем регистре', () => {
      expect(buildIssueSearchQuery('user', 'hz-230')).toBe('Key: "hz-230"')
    })

    it('обрезает пробелы вокруг ключа', () => {
      expect(buildIssueSearchQuery('user', '  HZ-230  ')).toBe('Key: "HZ-230"')
    })

    it('ключ с статусом', () => {
      expect(buildIssueSearchQuery('user', 'HZ-230', ['inProgress'])).toBe('Key: "HZ-230" Status: inProgress')
    })

    it('не считает HZ- без числа ключом', () => {
      expect(buildIssueSearchQuery('user', 'HZ-')).toContain('Summary: ~"HZ-"')
    })

    it('не считает текст с дефисом ключом', () => {
      expect(buildIssueSearchQuery('user', 'какой-то текст')).toContain('Summary: ~"какой-то текст"')
    })
  })

  describe('текстовый поиск по summary и key', () => {
    it('строит запрос с Assignee и Summary', () => {
      expect(buildIssueSearchQuery('lenston', 'Авторизация')).toBe('Assignee: lenston Summary: ~"Авторизация"')
    })

    it('добавляет фильтр статуса если передан', () => {
      expect(buildIssueSearchQuery('lenston', 'авторизация', ['open', 'inProgress'])).toBe(
        'Assignee: lenston Summary: ~"авторизация" Status: open, inProgress'
      )
    })

    it('не добавляет Status если statuses пустой массив', () => {
      const result = buildIssueSearchQuery('user', 'текст', [])
      expect(result).not.toContain('Status:')
    })

    it('не добавляет Status если statuses не передан', () => {
      const result = buildIssueSearchQuery('user', 'текст')
      expect(result).not.toContain('Status:')
    })

    it('экранирует кавычки в поисковом запросе', () => {
      expect(buildIssueSearchQuery('user', 'он сказал "да"')).toContain('\\"да\\"')
    })
  })
})
