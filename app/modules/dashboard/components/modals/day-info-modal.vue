<script setup lang="ts">
import { collectWorklogs } from '~/core/utils/collecting'
import type { Weekday } from '../../types'
import GroupedWorklogsTable from '~/core/components/worklogs/grouped-worklogs-table.vue'
import { pluralize } from '~/core/utils/pluralize'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

const props = defineProps<{
  day: Weekday
}>()

const worklogs = computed(() => {
  return collectWorklogs(props.day.items).result
})

const dayTotalHours = computed(() => pluralize(props.day.hours, HOURS_PLURALIZE))
</script>

<template>
  <modal-base
    v-slot="{ close }"
    :ui="{
      content: 'w-full sm:max-w-4xl'
    }"
  >
    <ui-card class="min-w-full md:min-w-[800px]">
      <template #header>
        <div class="flex justify-between">
          <span class="text-xl font-bold">
            {{ day.monthDay }}
          </span>
          <div class="text-lg">
            Часов за день:
            <span class="font-bold">
              {{ dayTotalHours }}
            </span>
          </div>
        </div>
      </template>

      <grouped-worklogs-table :rows="worklogs" />

      <template #footer>
        <div class="flex justify-end">
          <u-button
            label="Закрыть"
            @click="close()"
          />
        </div>
      </template>
    </ui-card>
  </modal-base>
</template>
