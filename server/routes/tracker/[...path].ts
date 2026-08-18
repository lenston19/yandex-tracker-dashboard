import type { H3Event } from 'h3'
import { defineEventHandler, getRequestHeaders, getRequestURL, proxyRequest } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event)
  const target = process.env.NUXT_PUBLIC_YANDEX_TRACKER_API ?? 'https://api.tracker.yandex.net/v2'
  const path = url.pathname.replace(/^\/tracker/, '')
  const fullPath = `${path}${url.search}`

  const headers = getRequestHeaders(event)
  const key = headers.authorization ?? 'anonymous'

  return runThrottled(key, () => proxyRequest(event, `${target}${fullPath}`, { headers }))
})
