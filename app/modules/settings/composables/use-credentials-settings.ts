import { useModal } from 'vue-final-modal'
import { storageKey } from '~/core/constants/storage-keys'

const YEAR = 60 * 60 * 24 * 30 * 12

export function useCredentialsSettings() {
  const organizationId = useCookie(storageKey('organizationId'), { maxAge: YEAR })
  const accessToken = useCookie(storageKey('accessToken'), { maxAge: YEAR })

  // Обратная совместимость с прошлыми значениями
  if (import.meta.client) {
    const oldOrganizationId = useCookie('organizationId')
    const oldAccessToken = useCookie('accessToken')
    if (oldOrganizationId.value && !organizationId.value) {
      organizationId.value = oldOrganizationId.value
      oldOrganizationId.value = null
    }
    if (oldAccessToken.value && !accessToken.value) {
      accessToken.value = oldAccessToken.value
      oldAccessToken.value = null
    }
  }

  const isNeedOrganizationId = computed(() => !organizationId.value)

  const clearState = () => {
    organizationId.value = ''
    accessToken.value = ''
  }

  const { open, close } = useModal({
    component: defineAsyncComponent(() => import('../components/modals/settings-organization-id-modal.vue'))
  })

  watchEffect(() => {
    if (isNeedOrganizationId.value) open()
    else close()
  })

  return {
    organizationId,
    accessToken,
    isNeedOrganizationId,
    clearState
  }
}
