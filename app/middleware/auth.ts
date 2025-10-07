import { SITEMAP } from '~/core/utils/router/sitemap'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'

export default defineNuxtRouteMiddleware(() => {
  const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

  if (!accessToken.value || !organizationId.value) {
    return navigateTo({ name: SITEMAP.settings.route.name })
  }
})
