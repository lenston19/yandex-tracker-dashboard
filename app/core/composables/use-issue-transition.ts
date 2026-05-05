import yandexTrackerApi from '../api/yandex-tracker.api'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'
import { useTimerStore } from '../store/use-timer-store'
import { useIssueBus } from './use-issue-bus'

export const useIssueTransition = () => {
  const timerStore = useTimerStore()
  const toast = useToast()

  const isTransitioning = ref(false)

  const isOpenStatus = (issue: Yandex.Issue) => {
    const id = issue.status?.id?.toLowerCase() ?? ''
    const display = issue.status?.display?.toLowerCase() ?? ''
    return id === 'open' || display.includes('открыт')
  }

  const selectIssue = (issue: Yandex.Issue, onNeedsConfirm: (issue: Yandex.Issue) => void) => {
    if (isOpenStatus(issue)) {
      onNeedsConfirm(issue)
    } else {
      timerStore.start(issue.key, issue.summary)
    }
  }

  const confirmTransition = async (issue: Yandex.Issue) => {
    isTransitioning.value = true
    try {
      const transitions = await yandexTrackerApi.issueTransitionsList(issue.key)
      const inProgressTransition = transitions?.find(
        t => t.to.id.toLowerCase().includes('inprogress') || t.to.display.toLowerCase().includes('работ')
      )
      if (inProgressTransition) {
        await yandexTrackerApi.issueTransitionExecute(issue.key, inProgressTransition.id)
      } else {
        toast.add({ title: 'Переход не найден', description: 'Таймер запущен без смены статуса', color: 'warning' })
      }
    } catch {
      toast.add({
        title: 'Не удалось сменить статус',
        description: 'Таймер запущен без смены статуса',
        color: 'warning'
      })
    } finally {
      isTransitioning.value = false
    }
    timerStore.start(issue.key, issue.summary)
    useIssueBus().emit('Refresh issue')
  }

  const cancelTransition = (issue: Yandex.Issue) => {
    timerStore.start(issue.key, issue.summary)
  }

  return {
    isTransitioning,
    selectIssue,
    confirmTransition,
    cancelTransition
  }
}
