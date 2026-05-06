const KEY_PATTERN = /^[A-Za-z]+-\d+$/

/**
 * Формирует YQL-запрос для поиска задач.
 *
 * - Точный ключ (например, HZ-230) → `Key: "HZ-230"`
 * - Произвольный текст → `[Assignee: {login} ]Summary: ~"{q}"`
 */
export const buildIssueSearchQuery = (q: string, login?: string, statuses?: string[]): string => {
  const trimmed = q.trim()
  const statusPart = statuses?.length ? ` Status: ${statuses.join(', ')}` : ''

  if (KEY_PATTERN.test(trimmed)) {
    return `Key: "${trimmed}"${statusPart}`
  }

  const escaped = trimmed.replace(/"/g, '\\"')
  const assigneePart = login ? `Assignee: ${login} ` : ''
  return `${assigneePart}Summary: "${escaped}"${statusPart}`
}
