import type { RouteLocationNamedRaw } from 'vue-router'
import type { AppRoute } from '~/core/utils/router/types'

export type GetAppRoutePayload = Pick<RouteLocationNamedRaw, 'params' | 'query' | 'hash'>
type GetAppRoute = (payload: GetAppRoutePayload) => AppRoute

export interface SitemapRoute {
  name: string
  icon?: string
  route: AppRoute
  getRoute?: GetAppRoute
}
