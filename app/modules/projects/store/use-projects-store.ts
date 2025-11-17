import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useQueuesStore } from '~/core/store/use-queues-store'
import { collectWorklogsByQueue } from '~/core/utils/collecting'
import type { QueueWorklogs } from '~/core/types/worklogs'

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
    params: worklogsStore.params,
    next: worklogsStore.next,
    prev: worklogsStore.prev,
    refresh: worklogsStore.refresh,
    isLoading,
    queueWorklogs
  }
})
