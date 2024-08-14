import { defineStore } from 'pinia'
import { ref } from '#imports'

export const useSiteSettingsStore = defineStore('site-settings', () => {
  const organizationId = ref<string>('')
	const accessToken = ref<string>('')

	const isNeedOrganizationId = computed(() => organizationId.value === '')

	const setOrganizationId = (id: string) => {
		organizationId.value = id
	}

	const setAccessToken = (token: string) => {
		accessToken.value = token
	}

	const clearState = () => {
		organizationId.value = ''
		accessToken.value = ''
	}

	return {
		organizationId,
		accessToken,
		isNeedOrganizationId,
		setOrganizationId,
		setAccessToken,
		clearState
	}
},
{
	persist: true,
})
