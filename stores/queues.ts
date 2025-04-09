import yandexTrackerApi from '~/api/yandex-tracker.api'
import type { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/stores/auth'

export const useQueuesStore = defineStore('queues', () => {
	const { login } = storeToRefs(useAuthStore())

	const fetchMoreQueues = async (totalPages: number) => {
		let counter = 2
		let queues: Yandex.Queue[] = []

		while (counter <= totalPages) {
			const iterResponse = await yandexTrackerApi.queuesList({
				page: String(counter)
			})
			if (iterResponse.status === 200 && iterResponse._data) {
				queues = [...queues, ...iterResponse._data]
			}
			counter++
		}

		return queues
	}

	const { data, refresh, status } = useLazyAsyncData(
		`queues-items`,
		async () => {
			if (!login.value) {
				return [] as Yandex.Queue[]
			}

			const response = await yandexTrackerApi.queuesList()

			if (!response._data) {
				return [] as Yandex.Queue[]
			}

			const totalPages = response.headers.get('X-Total-Pages')
			const totalCount = response.headers.get('X-Total-Count')

			let allQueues: Yandex.Queue[] = []
			if (totalPages && totalCount && +totalCount > 50) {
				allQueues = await fetchMoreQueues(+totalPages)
			}

			return [...response._data, ...allQueues]
		},
		{
			default: () => [] as Yandex.Queue[],
			server: false
		}
	)

	const isLoading = computed(() => status.value === 'pending')

	return {
		queuesModel: data,
		refresh,
		isLoading
	}
})
