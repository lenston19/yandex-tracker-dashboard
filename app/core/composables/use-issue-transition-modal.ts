import { useModal } from 'vue-final-modal'
import { AsyncModalTransition } from '../components/modal'
import { useIssueTransition } from './use-issue-transition'
import { parseRuDuration } from '../utils/time'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'

export const useIssueTransitionModal = () => {
  const { isTransitioning, selectIssue, confirmTransition, cancelTransition } = useIssueTransition()

  const pendingIssue = ref<Yandex.Issue | null>(null)

  const { open, close, patchOptions } = useModal({
    component: AsyncModalTransition,
    attrs: {
      onConfirm: async (estimationInput?: string) => {
        if (!pendingIssue.value) return
        const originalEstimation = estimationInput ? parseRuDuration(estimationInput) : undefined
        await confirmTransition(pendingIssue.value, originalEstimation)
        close()
      },
      onCancel: () => {
        if (pendingIssue.value) cancelTransition(pendingIssue.value)
      }
    }
  })

  watch(isTransitioning, loading => patchOptions({ attrs: { loading } }))

  const startWithConfirm = (issue: Yandex.Issue) => {
    selectIssue(issue, i => {
      pendingIssue.value = i
      patchOptions({
        attrs: {
          description: `Задача ${i.key} сейчас открыта.\nПеревести в 'В работе' и запустить таймер?`,
          existingEstimation: i.estimation && i.estimation !== 'PT0S' ? i.estimation : undefined
        }
      })
      open()
    })
  }

  return { startWithConfirm }
}
