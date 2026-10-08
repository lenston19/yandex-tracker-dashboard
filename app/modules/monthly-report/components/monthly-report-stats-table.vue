<script setup lang="ts">
import UiCard from '~/core/components/ui/ui-card.vue'
import WidgetHeroStat from '~/core/components/ui/widget-hero-stat.vue'
import WidgetHelpIcon from '~/core/components/ui/widget-help-icon.vue'
import { useMonthlyReportStore } from '../store/use-monthly-report-store'
import { pluralize } from '~/core/utils/pluralize'
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
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

const secondaryRows = computed(() => {
  const rows: { name: string; value: string; color: UiColors; helpText?: string }[] = []

  if (gold.value) {
    rows.push({ name: 'Заработано', value: formatRUB(earnedMoney.value), color: 'info' })
  }

  rows.push({
    name: 'Среднее часов в день',
    value: pluralize(averageHoursByMonth.value, HOURS_PLURALIZE),
    color: averageBadgeColor.value,
    helpText:
      'Часы за все дни / количество дней <br><span class="text-xs text-gray-300">* минимум 15 минут в день</span>'
  })

  rows.push({
    name: 'Точность оценки',
    value: estimationAccuracy.value.total ? `${estimationAccuracy.value.percent}%` : '—',
    color: accuracyBadgeColor.value,
    helpText: estimationAccuracy.value.total
      ? `Доля задач с оценкой, факт по которым не превысил её. <span class="font-semibold ${ACCURACY_TEXT_COLOR_CLASS[accuracyBadgeColor.value] ?? 'text-success'}">${estimationAccuracy.value.withinEstimate} из ${estimationAccuracy.value.total}</span> задач уложились в оценку`
      : 'Нет задач с оценкой за этот месяц'
  })

  return rows
})
</script>

<template>
  <ui-card title="Статистика">
    <u-skeleton
      v-if="isLoading"
      class="h-48 w-full"
    />
    <div
      v-else
      class="space-y-5"
    >
      <widget-hero-stat
        :value="totalHours"
        unit="ч за месяц"
      />

      <div class="space-y-2">
        <div
          v-for="row in secondaryRows"
          :key="row.name"
          class="flex items-center justify-between gap-2 text-sm"
        >
          <div class="flex items-center gap-1.5 text-muted">
            {{ row.name }}
            <widget-help-icon
              v-if="row.helpText"
              :text="row.helpText"
              :icon="HEROICONS.QUESTION_MARK_CIRCLE"
            />
          </div>
          <u-badge
            :label="row.value"
            :color="row.color"
            variant="subtle"
          />
        </div>
      </div>
    </div>
  </ui-card>
</template>
