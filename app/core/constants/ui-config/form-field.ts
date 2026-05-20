import type { TVConfig } from '@nuxt/ui'
import type * as ui from '#build/ui'

export const formField: TVConfig<typeof ui>['formField'] = {
  slots: {
    labelWrapper: 'max-sm:flex-col max-sm:items-start',
    hint: 'italic'
  }
}
