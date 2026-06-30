import { useModal } from 'vue-final-modal'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

export function useQuickWorklog() {
  const { open: openWorklogModal, patchOptions: patchWorklogModal } = useModal({
    component: defineAsyncComponent(() => import('../components/timer/quick-worklog-modal.vue'))
  })

  const { open: openIssueModal } = useModal({
    component: defineAsyncComponent(() => import('../components/timer/timer-issue-modal.vue')),
    attrs: {
      onSelect: (issue: Yandex.Issue) => {
        patchWorklogModal({ attrs: { issue } })
        openWorklogModal()
      }
    }
  })

  return { openQuickWorklog: openIssueModal }
}
