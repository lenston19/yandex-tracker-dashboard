import { useModal } from 'vue-final-modal'

const YEAR = 60 * 60 * 24 * 30 * 12

export function useCredentialsSettings() {
  const organizationId = useCookie('organizationId', { maxAge: YEAR })
  const accessToken = useCookie('accessToken', { maxAge: YEAR })
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
