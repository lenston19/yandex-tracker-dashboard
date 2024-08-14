import { $api } from "~/api/base.api"
import { YandexInfoApi } from "~/types/yandex-info/yandex-info.api"

export default {
	/**
	* Получения данных о пользователе из сервиса https://login.yandex.ru/info
	* @param format - формат возвращаемых данных: 'json' | 'xml' | 'jwt'. По умолчанию 'json'
	* @returns YandexInfoApi.fetchUser.GET.ResponseDTO
	*/
	async fetchUser (format: 'json' | 'xml' | 'jwt' = 'json') {
		return await $api<YandexInfoApi.fetchUser.GET.ResponseDTO>('/info/', {
			method: 'GET',
			params: {
				format
			}
		})
	},
}
