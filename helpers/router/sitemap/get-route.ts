import type { SitemapRoute, GetAppRoutePayload } from './types'
import type { AppRoute } from '~/src/shared/router/types'

export function getRoute(this: SitemapRoute, payload: GetAppRoutePayload): AppRoute {
  return {
    ...this.route,
    ...payload
  }
}
