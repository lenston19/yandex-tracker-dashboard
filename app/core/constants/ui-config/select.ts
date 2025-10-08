import type { TVConfig } from '@nuxt/ui'
import type * as ui from '#build/ui'

export const select: TVConfig<typeof ui>['select'] = {
  slots: {
    content: 'z-9999'
  }
}
