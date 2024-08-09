import { storeToRefs } from "pinia";
import { useAuthStore } from "~/store/auth";
import { useSiteSettingsStore } from "~/store/site-settings";

export const $api = $fetch.create({
	onRequest: ({ options }) => {
			const { organizationId } = storeToRefs(useSiteSettingsStore())
			const { accessToken } = storeToRefs(useAuthStore())

			options.headers = {
				'Authorization': `OAuth ${accessToken.value}`,
				'X-Cloud-Org-ID': organizationId.value
			}
		}
	})
