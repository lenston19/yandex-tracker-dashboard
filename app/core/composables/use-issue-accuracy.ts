import type { Ref } from 'vue'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import type { IssueEstimationStat, TopIssueStat, EstimationAccuracy } from '~/core/types/issue-accuracy'
import { calculateTotalHours, formatHoursToFixed, calculateDurationInHours } from '~/core/utils/time'
import { collectWorklogs } from '~/core/utils/collecting'
import { buildIssuesByKeysQuery } from '~/core/utils/issue-search'
import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import { fetchAllPages } from '~/core/utils/fetch-all-pages'
import { calcAccuracyByQueue } from '~/core/utils/monthly-insights'

const PER_PAGE = 50

export function useIssueAccuracy(worklogsModel: Ref<Yandex.Worklog[]>, isLoadingWorklogs: Ref<boolean>) {
  const issuesModel = ref<Yandex.Issue[]>([])
  const isLoadingIssues = ref(false)

  const isLoading = computed(() => isLoadingWorklogs.value || isLoadingIssues.value)

  const spentHoursByKey = computed(() => {
    const { groupedWorklogs } = collectWorklogs(worklogsModel.value)
    const map = new Map<string, number>()
    groupedWorklogs.forEach((items, key) => {
      map.set(key, formatHoursToFixed(calculateTotalHours(items)))
    })
    return map
  })

  const fetchIssues = async () => {
    const keys = Array.from(spentHoursByKey.value.keys())
    if (!keys.length) {
      issuesModel.value = []
      return
    }

    isLoadingIssues.value = true
    try {
      const query = buildIssuesByKeysQuery(keys)
      const fields = 'summary,estimation,queue'
      const response = await yandexTrackerApi.issueSearchRaw({ query, fields }, PER_PAGE)

      if (!response._data) {
        issuesModel.value = []
        return
      }

      const totalPages = response.headers.get('X-Total-Pages')
      const totalCount = response.headers.get('X-Total-Count')

      let result: Yandex.Issue[] = [...response._data]

      if (totalPages && totalCount && +totalCount > PER_PAGE) {
        const rest = await fetchAllPages(
          page => yandexTrackerApi.issueSearchRaw({ query, fields }, PER_PAGE, page),
          +totalPages
        )
        result = [...result, ...rest]
      }

      issuesModel.value = result
    } finally {
      isLoadingIssues.value = false
    }
  }

  const hasEstimation = (issue: Yandex.Issue) => Boolean(issue.estimation) && issue.estimation !== 'PT0S'

  const overEstimationIssues = computed<IssueEstimationStat[]>(() => {
    return issuesModel.value
      .filter(hasEstimation)
      .map(issue => {
        const spentHours = spentHoursByKey.value.get(issue.key) ?? 0
        const estimationHours = calculateDurationInHours(issue.estimation!)
        return { issue, spentHours, estimationHours, overageHours: formatHoursToFixed(spentHours - estimationHours) }
      })
      .filter(stat => stat.overageHours > 0)
      .sort((a, b) => b.overageHours - a.overageHours)
  })

  const totalOverageHours = computed(() =>
    formatHoursToFixed(overEstimationIssues.value.reduce((acc, stat) => acc + stat.overageHours, 0))
  )

  const estimationAccuracy = computed<EstimationAccuracy>(() => {
    const total = issuesModel.value.filter(hasEstimation).length
    const withinEstimate = total - overEstimationIssues.value.length
    const percent = total > 0 ? Math.round((withinEstimate / total) * 100) : 0
    return { total, withinEstimate, percent }
  })

  const topIssuesByHours = computed<TopIssueStat[]>(() => {
    return issuesModel.value
      .map(issue => ({ issue, hours: spentHoursByKey.value.get(issue.key) ?? 0 }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5)
  })

  const accuracyByQueue = computed(() => {
    const overEstimatedKeys = new Set(overEstimationIssues.value.map(stat => stat.issue.key))
    return calcAccuracyByQueue(
      issuesModel.value.filter(hasEstimation).map(issue => ({
        queueKey: issue.queue.key,
        queueName: issue.queue.display,
        isOverEstimated: overEstimatedKeys.has(issue.key)
      }))
    )
  })

  watch(isLoadingWorklogs, async loading => {
    if (!loading) await fetchIssues()
  })

  return {
    issuesModel,
    isLoading,
    overEstimationIssues,
    totalOverageHours,
    estimationAccuracy,
    topIssuesByHours,
    accuracyByQueue
  }
}
