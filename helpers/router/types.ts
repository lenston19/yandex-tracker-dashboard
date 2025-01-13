import type { RouteLocationNamedRaw } from 'vue-router'

export const enum AppRoutes {
	index = 'index',
	monthlyReport = 'monthly-report',
	projects = 'projects',
	settings = 'settings',
	changelog = 'changelog',
	auth = 'auth'
}

export interface AppRoute extends RouteLocationNamedRaw {
	name: AppRoutes
}
