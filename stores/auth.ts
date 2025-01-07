
import yandexTrackerApi from '~/api/yandex-tracker.api'
import yandexInfoApi from '~/api/yandex-info.api'
import yandexAvatarApi from '~/api/yandex-avatar.api'
import { useSiteSettingsStore } from '~/stores/site-settings'

export const useAuthStore = defineStore('auth', () => {
	const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())
	const userAvatarUrl = ref<string>('')

	const userName = computed(() => mySelf.value?.display || '')
	const login = computed(() => mySelf.value?.login || '')

	const { data: mySelf, refresh: refreshMySelf } = useLazyAsyncData('my-self', async () => {
		const response = await yandexTrackerApi.mySelf()
		if (response) {
			await fetchAvatar()
		}
		return response
	}, { server: false })

	watchEffect(() => {
		if (organizationId.value && accessToken.value) {
			refreshMySelf()
		}
	})

	const fetchAvatar = async () => {
		const responseUser = await yandexInfoApi.fetchUser()
		if (responseUser?.default_avatar_id) {
			const responseUserAvatar = await yandexAvatarApi.fetchUserAvatar(responseUser?.default_avatar_id)
			userAvatarUrl.value = URL.createObjectURL(new Blob([responseUserAvatar], { type: "image/jpeg" })) || ''
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
}, { persist: true })
