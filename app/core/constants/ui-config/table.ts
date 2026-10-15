import type { TVConfig } from '@nuxt/ui'
import type * as ui from '#build/ui'

export const table: TVConfig<typeof ui>['table'] = {
  slots: {
    th: 'px-3 py-2',
    td: 'px-3 py-2'
  }
}
