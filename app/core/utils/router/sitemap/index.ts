import { AppRoutes } from '~/core/utils/router/types'
import type { SitemapRoute } from '~/core/utils/router/sitemap/types'

const main: SitemapRoute = {
  name: 'YandexTracker Dashboard',
  route: {
    name: AppRoutes.index
  }
}

const monthlyReport: SitemapRoute = {
  name: 'Месячный отчет',
  route: {
    name: AppRoutes.monthlyReport
  }
}

const projects: SitemapRoute = {
  name: 'Проекты',
  route: {
    name: AppRoutes.projects
  }
}

const settings: SitemapRoute = {
  name: 'Настройки',
  route: {
    name: AppRoutes.settings
  }
}

const changelog: SitemapRoute = {
  name: 'Что нового?',
  route: {
    name: AppRoutes.changelog
  }
}

const auth: SitemapRoute = {
  name: 'Авторизация',
  route: {
    name: AppRoutes.auth
  }
}

const faq: SitemapRoute = {
  name: 'FAQ',
  route: {
    name: AppRoutes.faq
  }
}

export const SITEMAP = {
  main,
  monthlyReport,
  projects,
  settings,
  faq,
  changelog,
  auth
}
