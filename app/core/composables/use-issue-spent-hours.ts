import type { Ref } from 'vue'
import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { calculateTotalHours, formatHoursToFixed } from '~/core/utils/time'
import { retryOn429 } from '~/core/utils/fetch-all-pages'

const RATE_LIMIT_RETRIES = 2

export function useIssueSpentHours(displayEstimation: Ref<boolean>) {
  const issueSpentHoursMap = ref<Map<string, number>>(new Map())

  const fetchSpentHours = async (issueList: Yandex.Issue[]) => {
    if (!issueList.length || !displayEstimation.value) {
      issueSpentHoursMap.value = new Map()
      return
    }
    // Один запрос за раз (как и на сервере) — Tracker ограничивает частоту, не только конкуренцию.
    const results: { key: string; hours: number }[] = []
    for (const issue of issueList) {
      const worklogs = await retryOn429(() => yandexTrackerApi.worklogListByIssue(issue.key), RATE_LIMIT_RETRIES)
      results.push({ key: issue.key, hours: formatHoursToFixed(calculateTotalHours(worklogs ?? [])) })
    }
    issueSpentHoursMap.value = new Map(results.map(r => [r.key, r.hours]))
  }

  return { issueSpentHoursMap, fetchSpentHours }
}
