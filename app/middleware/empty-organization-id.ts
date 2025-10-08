export default defineNuxtRouteMiddleware(to => {
  if (import.meta.client) {
    const accessToken = new URLSearchParams(to.hash.slice(1)).get('access_token')
    if (!accessToken) {
      return navigateTo('/settings')
    }
  }
})
