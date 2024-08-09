import { $api } from "~/api/base.api"
import { Yandex } from "~/types/yandex"

export default {
	/*
	* Получение данных о пользователе
	*/
	async mySelf () {
		return await $api<Yandex.MySelf>('/yandex/myself', {
			method: 'GET'
		})
	},
	/*
	*
	*/
	async queuesList () {
		return await $api<Yandex.Queue[]>('/yandex/queues', {
			method: 'GET'
		})
	},
	/*
	*
	*/
	async worklogList (body: any, countPerPage: number = 50) {
		return await $api<Yandex.Worklog>(`/yandex/worklog/_search?perPage=${countPerPage}`, {
			method: 'POST',
			body
		})
	}
}
