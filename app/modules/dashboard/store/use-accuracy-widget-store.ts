import { useWorklogsStore } from '~/core/store/use-worklogs-store'
import { useIssueAccuracy } from '~/core/composables/use-issue-accuracy'

export const useAccuracyWidgetStore = defineStore('accuracy-widget', () => {
  const worklogsStore = useWorklogsStore('month', 'month-time-widget')
  const { worklogsModel, isLoading: isLoadingWorklogs, totalHours } = storeToRefs(worklogsStore)

  const { accuracyByQueue, isLoading } = useIssueAccuracy(worklogsModel, isLoadingWorklogs)

  return { accuracyByQueue, isLoading, totalHours, refresh: worklogsStore.refresh }
})
