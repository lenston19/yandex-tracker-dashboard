<script setup lang="ts">
import { differenceInCalendarDays } from 'date-fns'
import { useSiteSettingsStore } from '~/modules/settings'
import UiCard from '~/core/components/ui/ui-card.vue'
import { THEME_CELEBRATION_GLYPH } from '~/core/constants/theme-celebration-glyph'
import { THEME_CELEBRATION_NAME } from '~/core/constants/theme-celebration-name'
import { THEME_CELEBRATION_MESSAGES } from '~/core/constants/theme-celebration-message'
import { DAYS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { pluralize } from '~/core/utils/pluralize'
import { getUpcomingHolidayDate } from '~/core/utils/seasonal-theme-window'

const { seasonalTheme } = storeToRefs(useSiteSettingsStore())

const daysLeft = computed(() => {
  if (!seasonalTheme.value.type) return 0
  return differenceInCalendarDays(getUpcomingHolidayDate(seasonalTheme.value.type, new Date()), new Date())
})

const hasCountdown = computed(() => seasonalTheme.value.type === 'halloween' || seasonalTheme.value.type === 'new-year')

const showCountdown = computed(() => hasCountdown.value && daysLeft.value > 0)

const glyph = computed(() => (seasonalTheme.value.type ? THEME_CELEBRATION_GLYPH[seasonalTheme.value.type] : ''))
const name = computed(() => (seasonalTheme.value.type ? THEME_CELEBRATION_NAME[seasonalTheme.value.type] : ''))

/** Случайное поздравление из списка темы — выбирается один раз на сессию виджета */
const celebrationMessage = computed(() => {
  const type = seasonalTheme.value.type
  if (!type) return ''
  const messages = THEME_CELEBRATION_MESSAGES[type]
  return messages[Math.floor(Math.random() * messages.length)]
})
</script>

<template>
  <ui-card
    v-if="seasonalTheme.active && seasonalTheme.type"
    :title="name"
  >
    <div class="flex items-center gap-3">
      <span class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
        {{ glyph }}
      </span>

      <div
        v-if="showCountdown"
        class="flex items-baseline gap-1.5"
      >
        <span class="text-2xl font-bold text-highlighted">{{ pluralize(daysLeft, DAYS_PLURALIZE) }}</span>
        <span class="text-sm text-muted">до праздника</span>
      </div>

      <!-- <u-badge
        v-else-if="daysLeft > 0"
        color="neutral"
        variant="subtle"
        size="lg"
      >
        Скоро
      </u-badge> -->

      <span
        v-else
        class="text-sm font-medium"
      >
        {{ celebrationMessage }}
      </span>
    </div>
  </ui-card>
</template>
