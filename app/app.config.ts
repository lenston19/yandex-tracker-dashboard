import * as uiConfigs from '~/core/constants/ui-config'

export default defineAppConfig({
  ui: {
    ...uiConfigs,
    switch: uiConfigs.switch_toggle
  }
})
