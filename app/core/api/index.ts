import { useSiteSettingsStore } from '~/modules/settings'
import { useToast, useNuxtApp } from '#imports'

function showErrorToast(toast: { color: 'error'; title: string; description: string }) {
  useNuxtApp().runWithContext(() => useToast().add(toast))
}

let rateLimitToastShownUntil = 0

function showRateLimitToast(url: string) {
  const now = Date.now()
  if (now < rateLimitToastShownUntil) return
  rateLimitToastShownUntil = now + 5000
  showErrorToast({
    color: 'error',
    title: 'Слишком много запросов',
    description: `Сервер временно ограничил запросы. Повторяем загрузку: ${url}`
  })
}

export const $api = $fetch.create({
  timeout: 15000,
  onRequest: ({ options }) => {
    const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

    if (accessToken.value) {
      options.headers.set('Authorization', `OAuth ${accessToken.value}`)
    }
    if (organizationId.value) {
      options.headers.set('X-Cloud-Org-ID', organizationId.value)
    }
  },
  onResponse: ({ response }) => {
    if (import.meta.server) return

    if (response.status === 429) {
      showRateLimitToast(response.url)
      return
    }

    if (response.status >= 400) {
      let description = ''

      const data = response._data
      if (data?.errorMessages?.length) {
        description = Array.isArray(data.errorMessages) ? data.errorMessages.join('. ') : data.errorMessages
      } else if (data?.errors && typeof data.errors === 'object') {
        description = Object.values(data.errors).join('. ')
      } else {
        description = response.url
      }

      showErrorToast({
        color: 'error',
        title: `Ошибка! ${response.status}`,
        description
      })
    }
  },
  onRequestError: ({ error }) => {
    if (import.meta.server) return

    let description = ''

    if (Array.isArray(error.message)) {
      description = error.message.join('. ')
    } else if (error.message) {
      description = error.message
    }

    showErrorToast({
      color: 'error',
      title: 'Ошибка!',
      description
    })
  }
})
