import { defineStore, storeToRefs } from 'pinia'
import { useLazyAsyncData } from '#app'
import { ref } from '#imports'
import yandexTrackerApi from '~/api/yandex-tracker.api'
import yandexInfoApi from '~/api/yandex-info.api'
import yandexAvatarApi from '~/api/yandex-avatar.api'
import { useSiteSettingsStore } from '~/store/site-settings'

export const useAuthStore = defineStore('auth', () => {
	const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())
	const userAvatarUrl = ref<string>('')

	const userName = computed(() => mySelf.value?.display || '')
	const login = computed(() => mySelf.value?.login || '')

	const {
		data: mySelf,
		refresh: refreshMySelf
	} = useLazyAsyncData('my-self', async () => {
		if (!organizationId.value) {
			return null
		}
		const response = await yandexTrackerApi.mySelf()
		if (!response) {
			return null
		}
		await fetchAvatar()
		return response
	},
	{
		default: () => null,
		immediate: false,
	}
)

	watchEffect(() => {
		if (organizationId.value && accessToken.value) {
			refreshMySelf()
		}
	})

	const fetchAvatar = async () => {
		const responseUser = await yandexInfoApi.fetchUser()
		if (responseUser?.default_avatar_id) {
			const responseUserAvatar = await yandexAvatarApi.fetchUserAvatar(responseUser?.default_avatar_id)
			userAvatarUrl.value = window.URL.createObjectURL(new Blob([responseUserAvatar], { type: "image/jpeg" })) || ''
		}
	}

	const clearState = () => {
		mySelf.value = null
		userAvatarUrl.value = ''
	}

	return {
		mySelf,
		login,
		userName,
		userAvatarUrl,
		refreshMySelf,
		clearState,
	}
})
