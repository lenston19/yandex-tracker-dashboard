import { useModal } from 'vue-final-modal'
import { AsyncModalConfirm } from '../components/modal'
import { useIssueTransition } from './use-issue-transition'
import type { Yandex } from '../types/api/yandex-tracker/yandex-tracker.entity'

export const useIssueTransitionModal = () => {
  const { isTransitioning, selectIssue, confirmTransition, cancelTransition } = useIssueTransition()

  const pendingIssue = ref<Yandex.Issue | null>(null)

  const { open, close, patchOptions } = useModal({
    component: AsyncModalConfirm,
    attrs: {
      title: 'Перевести задачу в работу?',
      confirmLabel: 'Перевести и запустить',
      cancelLabel: 'Просто запустить',
      onConfirm: async () => {
        if (!pendingIssue.value) return
        await confirmTransition(pendingIssue.value)
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
        attrs: { description: `Задача ${i.key} сейчас открыта.\nПеревести в 'В работе' и запустить таймер?` }
      })
      open()
    })
  }

  return { startWithConfirm }
}
