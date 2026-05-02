import type { RouteLocationNamedRaw } from 'vue-router'

export const enum AppRoutes {
  index = 'index',
  monthlyReport = 'monthly-report',
  projects = 'projects',
  myIssues = 'my-issues',
  settings = 'settings',
  changelog = 'changelog',
  auth = 'auth',
  faq = 'faq',
  dayView = 'day-date'
}

export interface AppRoute extends RouteLocationNamedRaw {
  name: AppRoutes
}
