import { useSiteSettingsStore } from "~/stores/site-settings"
import { useToast } from '#imports'

export const $api = $fetch.create({
	onRequest: ({ options }) => {
		const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

		options.headers = {
			'Authorization': `OAuth ${accessToken.value}`,
			'X-Cloud-Org-ID': organizationId.value
		}
	},
	onRequestError: ({ error }) => {
		if (process.server) {
			return
		}

		let description = ''

		if (Array.isArray(error.message)) {
			description = error.message.join('. ')
		} else if (!error.message) {
			description = error.message
		}

		useToast().add({
			color: 'red',
			title: 'Ошибка!',
			description,
		})
	}
})
