import { defineStore } from 'pinia'
import { useLazyAsyncData } from '#app'
import { ref } from '#imports'

export const useSiteSettingsStore = defineStore('site-settings', () => {
  const organizationId = ref<string>('');

	const isNeedOrganizationId = computed(() => organizationId.value === '')

	const setOrganizationId = (id: string) => {
		organizationId.value = id
	}

	const clearState = () => {
		organizationId.value = ''
	}

	return {
		organizationId,
		isNeedOrganizationId,
		setOrganizationId,
		clearState
	}
},
{
	persist: true,
})
