import { defineStore, storeToRefs } from 'pinia'
import { useLazyAsyncData } from '#app'
import { ref } from '#imports'
import { Yandex } from '~/types/yandex';
import yandexApi from '~/api/yandex.api';
import { useSiteSettingsStore } from './site-settings';

export const useAuthStore = defineStore('auth', () => {
	const { organizationId } = storeToRefs(useSiteSettingsStore())
	const accessToken = ref<string>('');
	const toast = useToast()

	const {
		data: mySelf,
		refresh: refreshMySelf
	} = useLazyAsyncData('my-self', async () => {
		const response = await yandexApi.mySelf()
		if (response && response.login) {
			toast.add({ title: 'Авторизован' })
			return response
		}
		return await yandexApi.mySelf()
	})

	const userName = computed(() => mySelf.value?.display && accessToken.value ? mySelf.value.display : '')
	const login = computed(() => mySelf.value?.login || null)

	watch([organizationId, accessToken], () => {
		if (organizationId.value && accessToken.value) {
			refreshMySelf()
		}
	})

	const clearState = () => {
		accessToken.value = ''
		mySelf.value = null
	}

	const setAccessToken = (token: string) => {
		accessToken.value = token
	}

	return {
		mySelf,
		accessToken,
		login,
		userName,
		refreshMySelf,
		clearState,
		setAccessToken
	}
},
{
	persist: true
})
