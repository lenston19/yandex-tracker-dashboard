import { SITEMAP } from '~/core/utils/router/sitemap'
import { useSiteSettingsStore } from '~/modules/settings'

export default defineNuxtRouteMiddleware(() => {
  const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

  if (!accessToken.value || !organizationId.value) {
    return navigateTo({ name: SITEMAP.settings.route.name })
  }
})
