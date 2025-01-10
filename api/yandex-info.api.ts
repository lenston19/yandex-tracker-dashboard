import { $api } from '~/api/base.api'
import { YandexInfo } from '~/types/yandex-info/yandex-info.entity'

export default {
	/**
	 * Получения данных о пользователе из сервиса https://login.yandex.ru/info
	 * @param format - формат возвращаемых данных: 'json' | 'xml' | 'jwt'. По умолчанию 'json'
	 * @returns YandexInfo.Avatar
	 */
	async fetchUser(format: 'json' | 'xml' | 'jwt' = 'json') {
		return await $api<YandexInfo.Avatar>('/info/', {
			method: 'GET',
			params: {
				format
			}
		})
	}
}
