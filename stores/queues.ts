import yandexTrackerApi from '~/api/yandex-tracker.api'
import { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'
import { useAuthStore } from '~/stores/auth'

export const useQueuesStore = defineStore('queues', () => {
	const { login } = storeToRefs(useAuthStore())

	const { data, refresh, status } = useLazyAsyncData(
		`queues-items`,
		async () => {
			if (!login.value) {
				return [] as Yandex.Queue[]
			}

			return await yandexTrackerApi.queuesList()
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
