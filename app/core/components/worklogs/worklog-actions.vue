<script setup lang="ts">
import type { WorklogActionsProps } from '../../types/worklogs'
import { HEROICONS } from '../../constants/heroicons'

const props = defineProps<WorklogActionsProps>()

const text = computed(() => {
  switch (props.type) {
    case 'day':
      return { prev: 'Предыдущий день', next: 'Следующий день', refresh: 'Обновить день' }
    case 'week':
      return { prev: 'Предыдущая неделя', next: 'Следующая неделя', refresh: 'Обновить неделю' }
    case 'month':
      return { prev: 'Предыдущий месяц', next: 'Следующий месяц', refresh: 'Обновить месяц' }

    default:
      return { prev: 'Предыдущий период', next: 'Следующий период', refresh: 'Обновить' }
  }
})
</script>

<template>
  <div class="flex items-center gap-4">
    <div
      v-if="prev || next"
      class="flex items-center"
    >
      <u-tooltip
        v-if="prev"
        :text="text.prev"
        :delay-duration="0"
      >
        <u-button
          :icon="HEROICONS.ARROW_LEFT"
          variant="link"
          :aria-label="text.prev"
          :loading="loading"
          @click="prev"
        />
      </u-tooltip>
      <u-tooltip
        v-if="next"
        :text="text.next"
        :delay-duration="0"
      >
        <u-button
          :icon="HEROICONS.ARROW_RIGHT"
          variant="link"
          :aria-label="text.next"
          :loading="loading"
          @click="next"
        />
      </u-tooltip>
    </div>
    <u-tooltip :text="text.refresh">
      <u-button
        :icon="HEROICONS.ARROW_PATH"
        :aria-label="text.refresh"
        :loading="loading"
        @click="refresh()"
      />
    </u-tooltip>
  </div>
</template>
