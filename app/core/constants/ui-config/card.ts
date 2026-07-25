import type { TVConfig } from '@nuxt/ui'
import type * as ui from '#build/ui'

export const card: TVConfig<typeof ui>['card'] = {
  slots: {
    root: 'flex flex-col',
    body: 'flex-1 p-2 sm:p-4',
    header: 'p-2 sm:p-4',
    footer: 'p-2 sm:p-4'
  },
  variants: {
    variant: {
      outline: {
        root: 'bg-elevated shadow-md shadow-black/20 ring ring-default divide-y divide-accented'
      }
    }
  }
}
