import { HEROICONS } from '~/helpers/static/heroicons'
import { SITEMAP } from '~/helpers/router/sitemap/index'

export const pages = [
	[
		{
			to: SITEMAP.main.route,
			label: 'Дашборд',
			icon: HEROICONS.HOME
		},
		{
			to: SITEMAP.projects.route,
			label: SITEMAP.projects.name,
			icon: HEROICONS.FOLDER
		},
		{
			to: SITEMAP.monthlyReport.route,
			label: SITEMAP.monthlyReport.name,
			icon: HEROICONS.CHART_BAR
		}
	],
	[
		{
			to: SITEMAP.changelog.route,
			label: SITEMAP.changelog.name,
			icon: HEROICONS.INFORMATION_CIRCLE
		},
		{
			to: SITEMAP.settings.route,
			label: SITEMAP.settings.name,
			icon: HEROICONS.COG
		}
	]
]
