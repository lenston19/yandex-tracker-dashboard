import type { Ref } from 'vue'
import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { calculateTotalHours, formatHoursToFixed } from '~/core/utils/time'

export function useIssueSpentHours(displayEstimation: Ref<boolean>) {
  const issueSpentHoursMap = ref<Map<string, number>>(new Map())

  const fetchSpentHours = async (issueList: Yandex.Issue[]) => {
    if (!issueList.length || !displayEstimation.value) {
      issueSpentHoursMap.value = new Map()
      return
    }
    const results = await Promise.all(
      issueList.map(async issue => {
        const worklogs = await yandexTrackerApi.worklogListByIssue(issue.key)
        return { key: issue.key, hours: formatHoursToFixed(calculateTotalHours(worklogs ?? [])) }
      })
    )
    issueSpentHoursMap.value = new Map(results.map(r => [r.key, r.hours]))
  }

  return { issueSpentHoursMap, fetchSpentHours }
}
