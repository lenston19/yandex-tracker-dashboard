const escapeHtml = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const highlightText = (text: string, query: string): string => {
  const safe = escapeHtml(text)
  if (!query.trim()) return safe
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return safe.replace(new RegExp(escaped, 'gi'), match => `<mark>${match}</mark>`)
}
