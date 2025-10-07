import { HEROICONS } from '~/constants/heroicons'
import { useAppVersionStore } from '~/stores/use-app-version-store'

export default defineNuxtPlugin(() => {
  const appVersion = useRuntimeConfig().public.appVersion
  const versionStore = useAppVersionStore()
  const toast = useToast()

  if (versionStore.appVersion && versionStore.appVersion !== appVersion) {
    toast.add({
      title: 'Доступна новая версия приложения.',
      description: 'Что нового?',
      icon: HEROICONS.INFORMATION_CIRCLE,
      close: false,
      progress: false,
      actions: [
        {
          label: 'Узнать',
          trailingIcon: HEROICONS.QUESTION_MARK_CIRCLE,
          onClick: () => {
            versionStore.setVersion(appVersion)
            useRouter().push('/changelog')
          }
        }
      ]
    })
  } else {
    versionStore.setVersion(appVersion)
  }
})
