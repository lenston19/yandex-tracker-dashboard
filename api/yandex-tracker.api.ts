import { $api } from "~/api/base.api"
import { YandexTrackerApi } from "~/types/yandex-tracker/yandex-tracker.api"
import { Yandex } from "~/types/yandex-tracker/yandex-tracker.entity"

export default {
	/**
	* Получение данных о пользователе из сервиса https://api.tracker.yandex.net/v2
	* @return YandexTrackerApi.mySelf.GET.ResponseDTO
	*/
	async mySelf () {
		return await $api<YandexTrackerApi.mySelf.GET.ResponseDTO>('/tracker/myself', {
			method: 'GET'
		})
	},
	/**
	* Получение данных об очередях из сервиса https://api.tracker.yandex.net/v2
	* @return YandexTrackerApi.queuesList.GET.ResponseDTO
	*/
	async queuesList () {
		return await $api<YandexTrackerApi.queuesList.GET.ResponseDTO>('/tracker/queues', {
			method: 'GET'
		})
	},
	/**
	* Получение данных о учете времени пользователя из сервиса https://api.tracker.yandex.net/v2
	* @param body YandexTrackerApi.worklogList.GET.RequestDTO
	* @param params Query params
	* @param countPerPage Количество записей на странице. По умолчанию - 50
	* @return Yandex.Worklog[]
	*/
	async worklogList (body: YandexTrackerApi.worklogList.GET.RequestDTO, params?: Record<string, string>, countPerPage: number = 50) {
		const queryParams = {
			perPage: countPerPage,
			...params
		}
		return await $api.raw<Yandex.Worklog[]>('/tracker/worklog/_search', {
			method: 'POST',
			params: queryParams,
			body
		},)
	}
}
