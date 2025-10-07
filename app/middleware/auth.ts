import { SITEMAP } from '~/helpers/router/sitemap'
import { useSiteSettingsStore } from '~/stores/use-site-settings-store'

export default defineNuxtRouteMiddleware(() => {
  const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

  if (!accessToken.value || !organizationId.value) {
    return navigateTo({ name: SITEMAP.settings.route.name })
  }
})
