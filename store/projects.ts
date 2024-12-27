import { defineStore, storeToRefs } from 'pinia'
import { useWorklogsStore } from '~/store/worklogs'
import { useQueuesStore } from '~/store/queues'
import { QueueWorklogs, collectWorklogsByQueue } from '~/helpers/utils/collecting'

export const useProjectsStore = defineStore('projects', () => {
	const worklogsStore = useWorklogsStore('month', 'projects')
	const queuesStore = useQueuesStore()

	const { worklogsModel, isLoading: isLoadingWorklogs } = storeToRefs(worklogsStore)
	const { queuesModel, isLoading: isLoadingQueue } = storeToRefs(queuesStore)
	const isLoading = computed(() => isLoadingWorklogs.value || isLoadingQueue.value)

	const queueWorklogs = computed(() => {
		if (!isLoading.value && worklogsModel.value.length && queuesModel.value.length) {
			return collectWorklogsByQueue(queuesModel.value, worklogsModel.value)
		}
		return [] as QueueWorklogs[]
	})


	return {
		worklogsModel,
		queuesModel,
		next: worklogsStore.next,
		prev: worklogsStore.prev,
		refresh: worklogsStore.refresh,
		isLoading,
		queueWorklogs
	}
})
