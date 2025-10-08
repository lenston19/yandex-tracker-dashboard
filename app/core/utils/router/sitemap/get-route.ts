import type { AppRoute } from '../types'
import type { SitemapRoute, GetAppRoutePayload } from './types'

export function getRoute(this: SitemapRoute, payload: GetAppRoutePayload): AppRoute {
  return {
    ...this.route,
    ...payload
  }
}
