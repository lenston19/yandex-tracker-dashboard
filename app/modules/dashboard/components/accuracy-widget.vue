<script setup lang="ts">
import UiCard from '~/core/components/ui/ui-card.vue'
import UiEmptyState from '~/core/components/ui/ui-empty-state.vue'
import WorklogActions from '~/core/components/worklogs/worklog-actions.vue'
import { useAccuracyWidgetStore } from '../store/use-accuracy-widget-store'

const ACCURACY_GOOD_THRESHOLD = 70

const store = useAccuracyWidgetStore()
const { accuracyByQueue, isLoading, totalHours } = storeToRefs(store)

onMounted(async () => {
  if (!totalHours.value && !isLoading.value) {
    await store.refresh()
  }
})
</script>

<template>
  <ui-card title="Точность оценок">
    <u-skeleton
      v-if="isLoading"
      class="h-32 w-full"
    />

    <ui-empty-state
      v-else-if="!accuracyByQueue.length"
      title="Нет оценённых задач"
    />

    <div
      v-else
      class="space-y-4"
    >
      <div
        v-for="stat in accuracyByQueue"
        :key="stat.queueKey"
        class="space-y-1"
      >
        <div class="flex items-baseline justify-between text-sm">
          <span class="font-medium text-highlighted">{{ stat.queueName }}</span>
          <span class="text-muted">{{ stat.percent }}%</span>
        </div>
        <u-progress
          :model-value="stat.percent"
          :max="100"
          :color="stat.percent >= ACCURACY_GOOD_THRESHOLD ? 'success' : 'error'"
          size="sm"
        />
      </div>
    </div>

    <template #footer>
      <worklog-actions
        class="ml-auto w-fit"
        :refresh="store.refresh"
        :loading="isLoading"
      />
    </template>
  </ui-card>
</template>
