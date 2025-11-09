import type { TVConfig } from '@nuxt/ui'
import type * as ui from '#build/ui'

export const switch_toggle: TVConfig<typeof ui>['switch'] = {
  slots: {
    base: 'cursor-pointer'
  }
}
