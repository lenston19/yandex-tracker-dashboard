import yandexTrackerApi from '../api/yandex-tracker.api'
import yandexInfoApi from '../api/yandex-info.api'
import yandexAvatarApi from '../api/yandex-avatar.api'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

    const userName = computed(() => mySelf.value?.display || '')
    const login = computed(() => mySelf.value?.login || '')

    const {
      data: mySelf,
      refresh: refreshMySelf,
      pending: isLoadingMySelf
    } = useLazyAsyncData('my-self', async () => await yandexTrackerApi.mySelf(), {
      immediate: false,
      server: false
    })

    watchEffect(async () => {
      if (organizationId.value && !!accessToken.value && !mySelf.value) {
        await refreshMySelf()
      }

      if (organizationId.value && accessToken.value && mySelf.value) {
        await fetchProfile()
        await fetchAvatar()
      }
    })

    const {
      data: user,
      refresh: fetchProfile,
      pending: isLoadingUser
    } = useLazyAsyncData('profile', async () => await yandexInfoApi.fetchUser(), {
      immediate: false,
      server: false,
      pick: ['default_avatar_id']
    })

    const {
      data: avatar,
      refresh: fetchAvatar,
      pending: isLoadingAvatar
    } = useLazyAsyncData(
      'avatar',
      async () => {
        if (!user.value) {
          return ''
        }
        return (
          URL.createObjectURL(
            new Blob([await yandexAvatarApi.fetchUserAvatar(user.value.default_avatar_id)], {
              type: 'image/jpeg'
            })
          ) || ''
        )
      },
      {
        immediate: false,
        server: false
      }
    )

    function clearState() {
      mySelf.value = undefined
    }

    const isLoading = computed(() => isLoadingMySelf.value || isLoadingUser.value || isLoadingAvatar.value)

    return {
      mySelf,
      login,
      userName,
      userAvatarUrl: avatar,
      refreshMySelf,
      clearState,
      isLoading
    }
  },
  { persist: true }
)
