import { HEROICONS } from '~/helpers/static/heroicons'
import { SITEMAP } from '~/helpers/router/sitemap/index'

export const pages = [
	[
		{
			...SITEMAP.main,
			label: 'Дашборд',
			icon: HEROICONS.HOME
		},
		{
			...SITEMAP.projects,
			label: SITEMAP.projects.name,
			icon: HEROICONS.FOLDER
		},
		{
			...SITEMAP.monthlyReport,
			label: SITEMAP.monthlyReport.name,
			icon: HEROICONS.CHART_BAR
		}
	],
	[
		{
			...SITEMAP.changelog,
			label: SITEMAP.changelog.name,
			icon: HEROICONS.INFORMATION_CIRCLE
		},
		{
			...SITEMAP.settings,
			label: SITEMAP.settings.name,
			icon: HEROICONS.COG
		}
	]
]
