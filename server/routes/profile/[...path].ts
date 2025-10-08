import type { H3Event } from 'h3'
import { defineEventHandler, getRequestHeaders, getRequestURL, proxyRequest } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event)
  const target = 'https://login.yandex.ru/info'
  const path = url.pathname.replace(/^\/profile\/info/, '')
  const fullPath = `${path}${url.search}`

  return proxyRequest(event, `${target}${fullPath}`, {
    headers: getRequestHeaders(event)
  })
})
