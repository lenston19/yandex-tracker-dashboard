import { defineAppConfig } from '#imports'

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
	},

	icon: {
		mode: 'svg'
	}
})
