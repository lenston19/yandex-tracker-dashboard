import { defineStore, storeToRefs } from 'pinia'
import yandexTrackerApi from '~/api/yandex-tracker.api'
import { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/store/auth'

export const useQueuesStore = defineStore('queues', () => {
		const { login } = storeToRefs(useAuthStore())

		const {
			data,
			refresh,
			status: requestStatus
		} = useLazyAsyncData(`queues-items`, async () => {
			if (!login.value) {
				return [] as Yandex.Queue[]
			}

			return await yandexTrackerApi.queuesList()
		}, {
			server: false
		})

		const isLoading = computed(() => requestStatus.value !== 'success')

		return {
			queuesModel: data,
			refresh,
			isLoading
		}
})
