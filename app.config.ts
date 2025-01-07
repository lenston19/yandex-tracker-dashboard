import { defineAppConfig } from '#imports'
import { HEROICONS } from './helpers/static/heroicons'

export default defineAppConfig({
	ui: {
		formGroup: {
			error: 'mt-1 text-xs',
			help: 'mt-1 text-xs text-gray-600 dark:text-gray-600',
			hint: 'dark:text-gray-950',
			label: {
				base: 'dark:text-white'
			}
		},

		notifications: {
			wrapper: 'z-[1101]',
			position: 'top-0 bottom-auto left-1/2 transform -translate-x-1/2'
		},

		table: {
			default: {
				emptyState: { icon: HEROICONS.CIRCLE_STACK_20_SOLID, label: 'Нет данных' }
			}
		}
	},

	icon: {
		mode: 'svg'
	}
})
