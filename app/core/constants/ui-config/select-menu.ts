import type { TVConfig } from '@nuxt/ui'
import type * as ui from '#build/ui'

export const selectMenu: TVConfig<typeof ui>['selectMenu'] = {
  slots: {
    content: 'z-9999'
  }
}
