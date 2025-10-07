import type { TVConfig } from '@nuxt/ui'
import type * as ui from '#build/ui'

export const button: TVConfig<typeof ui>['button'] = {
  slots: {
    base: 'cursor-pointer'
  }
}
