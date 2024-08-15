import { storeToRefs } from "pinia"
import { useSiteSettingsStore } from "~/store/site-settings"

export const $api = $fetch.create({
	onRequest: ({ options }) => {
			const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

			options.headers = {
				'Authorization': `OAuth ${accessToken.value}`,
				'X-Cloud-Org-ID': organizationId.value
			}
		},
	})
