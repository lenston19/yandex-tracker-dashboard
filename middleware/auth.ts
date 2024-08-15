import { storeToRefs } from "pinia"
import { useSiteSettingsStore } from "~/store/site-settings"

export default defineNuxtRouteMiddleware(() => {
	const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

	if (!accessToken.value || !organizationId.value) {
		return navigateTo('/settings')
	}
})
