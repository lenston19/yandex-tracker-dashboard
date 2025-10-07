import type { H3Event } from 'h3'
import { defineEventHandler, getRequestHeaders, getRequestURL, proxyRequest } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event)
  const target = 'https://avatars.yandex.net/get-yapic'
  const path = url.pathname.replace(/^\/avatar/, '')
  const fullPath = `${path}${url.search}`

  return proxyRequest(event, `${target}${fullPath}`, {
    headers: getRequestHeaders(event)
  })
})
