import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useToast } from '#imports'

export const $api = $fetch.create({
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

    if (response.status >= 400) {
      let description = ''

      const data = response._data
      if (data?.errorMessages) {
        description = Array.isArray(data.errorMessages) ? data.errorMessages.join('. ') : data.errorMessages
      } else {
        description = response.url
      }

      useToast().add({
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
    } else if (!error.message) {
      description = error.message
    }

    useToast().add({
      color: 'error',
      title: 'Ошибка!',
      description
    })
  }
})
