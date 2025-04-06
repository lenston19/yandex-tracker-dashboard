import { $api } from '~/api/base.api'
import type { YandexTrackerApi } from '~/types/yandex-tracker/yandex-tracker.api'
import type { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'

export default {
	/**
	 * Получение данных о пользователе из сервиса https://api.tracker.yandex.net/v2
	 * @return Yandex.MySelf
	 */
	async mySelf() {
		return await $api<Yandex.MySelf>('/tracker/myself', {
			method: 'GET'
		})
	},
	/**
	 * Получение данных об очередях из сервиса https://api.tracker.yandex.net/v2
	 * @return Yandex.Queue[]
	 */
	async queuesList() {
		return await $api<Yandex.Queue[]>('/tracker/queues', {
			method: 'GET'
		})
	},
	/**
	 * Получение данных о учете времени пользователя из сервиса https://api.tracker.yandex.net/v2
	 * @param body YandexTrackerApi.worklogList.Body
	 * @param params Query params
	 * @param countPerPage Количество записей на странице. По умолчанию - 50
	 * @return Yandex.Worklog[]
	 */
	async worklogList(
		body: YandexTrackerApi.worklogList.Body,
		params?: Record<string, string>,
		countPerPage: number = 50
	) {
		const queryParams = {
			perPage: countPerPage,
			...params
		}
		return await $api.raw<Yandex.Worklog[]>('/tracker/worklog/_search', {
			method: 'POST',
			params: queryParams,
			body
		})
	}
}
