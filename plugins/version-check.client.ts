import { HEROICONS } from '~/helpers/static/heroicons'
import { useAppVersionStore } from '~/stores/app-version'

export default defineNuxtPlugin(() => {
	const appVersion = useRuntimeConfig().public.appVersion
	const versionStore = useAppVersionStore()
	const toast = useToast()

	if (versionStore.appVersion && versionStore.appVersion !== appVersion) {
		toast.add({
			title: 'Доступна новая версия приложения.',
			description: 'Обновить страницу?',
			icon: HEROICONS.INFORMATION_CIRCLE,
			// @ts-ignore
			// Выключение кнопки закрытия уведомления
			closeButton: null,
			timeout: 0,
			actions: [
				{
					label: 'Обновить',
					icon: HEROICONS.ARROW_PATH,
					click: () => {
						versionStore.setVersion(appVersion)
						location.reload()
					}
				}
			]
		})
	} else {
		versionStore.setVersion(appVersion)
	}
})
