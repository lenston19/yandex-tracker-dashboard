import { useSiteSettingsStore } from '~/stores/site-settings'

export default defineNuxtRouteMiddleware(() => {
	const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

	if (!accessToken.value || !organizationId.value) {
		return navigateTo('/settings')
	}
})
