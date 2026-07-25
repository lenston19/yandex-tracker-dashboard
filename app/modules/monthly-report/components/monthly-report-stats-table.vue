<script setup lang="ts">
import UiCard from '~/core/components/ui/ui-card.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'
import { pluralize } from '~/core/utils/pluralize'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { MONTHLY_REPORT_COLUMNS } from '../constants/columns'
import { HEROICONS } from '~/core/constants/heroicons'
import { formatRUB } from '~/core/utils/format-money'
import type { UiColors } from '~/core/types'

const { totalHours, averageHoursByMonth, estimationAccuracy, gold, earnedMoney, isLoading } =
  storeToRefs(useMonthlyReportStore())

const averageBadgeColor = computed((): UiColors => {
  switch (true) {
    case averageHoursByMonth.value < 5:
      return 'error'
    case averageHoursByMonth.value < 8:
      return 'warning'
    default:
      return 'success'
  }
})

const accuracyBadgeColor = computed((): UiColors => {
  if (!estimationAccuracy.value.total) return 'secondary'
  switch (true) {
    case estimationAccuracy.value.percent < 70:
      return 'error'
    case estimationAccuracy.value.percent < 90:
      return 'warning'
    default:
      return 'success'
  }
})

const ACCURACY_TEXT_COLOR_CLASS: Partial<Record<UiColors, string>> = {
  error: 'text-error',
  warning: 'text-warning',
  success: 'text-success'
}

const data = computed(() => {
  return [
    {
      name: 'Часов за месяц',
      value: pluralize(totalHours.value, HOURS_PLURALIZE),
      attrs: {
        color: 'secondary' as UiColors
      }
    },
    ...(gold.value
      ? [
          {
            name: 'Заработано',
            value: formatRUB(earnedMoney.value),
            attrs: {
              color: 'info' as UiColors
            }
          }
        ]
      : []),
    {
      name: 'Среднее значение часов за месяц',
      value: pluralize(averageHoursByMonth.value, HOURS_PLURALIZE),
      helpText:
        'Часы за все дни / количество дней <br><span class="text-xs text-gray-300">* минимум 15 минут в день</span>',
      attrs: {
        color: averageBadgeColor.value
      }
    },
    {
      name: 'Точность оценки',
      value: estimationAccuracy.value.total ? `${estimationAccuracy.value.percent}%` : '—',
      helpText: estimationAccuracy.value.total
        ? `Доля задач с оценкой, факт по которым не превысил её. <span class="font-semibold ${ACCURACY_TEXT_COLOR_CLASS[accuracyBadgeColor.value] ?? 'text-success'}">${estimationAccuracy.value.withinEstimate} из ${estimationAccuracy.value.total}</span> задач уложились в оценку`
        : 'Нет задач с оценкой за этот месяц',
      attrs: {
        color: accuracyBadgeColor.value
      }
    }
  ]
})
</script>

<template>
  <ui-card title="Статистика">
    <div class="flex justify-center">
      <u-table
        v-if="!isLoading"
        :data="data"
        :columns="MONTHLY_REPORT_COLUMNS"
        class="w-full"
      >
        <template #name-cell="{ row }">
          <div class="flex items-center gap-2 text-wrap">
            {{ row.original.name }}
            <u-popover
              v-if="row.original.helpText?.length"
              :ui="{ content: 'h-auto items-start' }"
            >
              <u-icon
                :name="HEROICONS.QUESTION_MARK_CIRCLE"
                class="size-3.5 shrink-0 cursor-help text-muted"
              />
              <template #content>
                <span
                  class="block max-w-[226px] p-1 text-xs"
                  v-html="row.original.helpText"
                />
              </template>
            </u-popover>
          </div>
        </template>
        <template #value-cell="{ row }">
          <u-badge
            :label="row.original.value"
            v-bind="row.original.attrs"
          />
        </template>
      </u-table>
      <u-skeleton
        v-else
        class="h-48 w-full"
      />
    </div>
  </ui-card>
</template>
