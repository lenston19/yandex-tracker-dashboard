import { storageKey } from '~/core/constants/storage-keys'

export const useAppVersionStore = defineStore('app-version', () => {
  const appVersion = useCookie(storageKey('app-version'))

  // Обратная совместимость с прошлыми значениями
  if (import.meta.client) {
    const oldAppVersion = useCookie('app-version')
    if (oldAppVersion.value && !appVersion.value) {
      appVersion.value = oldAppVersion.value
      oldAppVersion.value = null
    }
  }

  function setVersion(version: string) {
    appVersion.value = version
  }

  return {
    appVersion,
    setVersion
  }
})
