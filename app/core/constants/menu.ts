import { HEROICONS } from '~/core/constants/heroicons'
import { SITEMAP } from '~/core/utils/router/sitemap/index'

export const AUTH_APP_PAGES = [
  {
    to: SITEMAP.main.route,
    label: 'Дашборд',
    icon: HEROICONS.HOME,
    prefetch: false
  },
  {
    to: SITEMAP.projects.route,
    label: SITEMAP.projects.name,
    icon: HEROICONS.FOLDER,
    prefetch: false
  },
  {
    to: SITEMAP.monthlyReport.route,
    label: SITEMAP.monthlyReport.name,
    icon: HEROICONS.CHART_BAR,
    prefetch: false
  }
]

export const UNAUTH_APP_PAGES = [
  {
    to: SITEMAP.changelog.route,
    label: SITEMAP.changelog.name,
    icon: HEROICONS.INFORMATION_CIRCLE,
    prefetch: false
  },
  {
    to: SITEMAP.settings.route,
    label: SITEMAP.settings.name,
    icon: HEROICONS.COG,
    prefetch: false
  }
]

export const APP_PAGES = [AUTH_APP_PAGES, UNAUTH_APP_PAGES]
