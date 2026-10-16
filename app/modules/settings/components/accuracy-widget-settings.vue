<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import UiCard from '~/core/components/ui/ui-card.vue'
import { HEROICONS } from '~/core/constants/heroicons'

const { accuracyWidget } = storeToRefs(useSiteSettingsStore())
</script>

<template>
  <ui-card
    title="Точность оценок"
    :ui="{ body: 'sm:p-0 p-0' }"
  >
    <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
      <div class="min-w-0">
        <p class="text-sm font-medium">Показывать виджет</p>
        <p class="text-xs text-muted">Процент задач, уложившихся в оценку, по очередям</p>
      </div>
      <u-switch
        v-model="accuracyWidget.show"
        class="shrink-0"
        :checked-icon="HEROICONS.CHECK_20_SOLID"
        :unchecked-icon="HEROICONS.X_MARK_20_SOLID"
      />
    </div>
  </ui-card>
</template>
