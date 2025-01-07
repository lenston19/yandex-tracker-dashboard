import { HEROICONS } from "~/helpers/static/heroicons"

export const pages = [
	[{
		label: 'Дашборд',
		icon: HEROICONS.HOME,
		to: {
			name: 'index'
		}
	},
	{
		label: 'Проекты',
		icon: HEROICONS.FOLDER,
		to: {
			name: 'projects'
		}
	},
	{
		label: 'Месячный отчет',
		icon: HEROICONS.CHART_BAR,
		to: {
			name: 'monthly-report'
		}
	}],
	[
		{
			label: 'Настройки',
			icon: HEROICONS.COG,
			to: {
				name: 'settings'
			}
		}
	]

]
