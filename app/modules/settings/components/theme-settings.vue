<script setup lang="ts">
import UiCard from '~/core/components/ui/ui-card.vue'
import { useSiteSettingsStore } from '~/modules/settings'

const { seasonalThemeActive, isHaveThemeType, themeEntities } = storeToRefs(useSiteSettingsStore())

const THEME_ENTITY_OPTIONS = [
  { key: 'cursor', label: 'Курсор', description: 'Тематический курсор мыши' },
  { key: 'background', label: 'Фон', description: 'Виньетка, туман, паутина и другие фоновые акценты' },
  { key: 'particles', label: 'Частицы', description: 'Летающие/падающие декоративные элементы' },
  { key: 'celebrations', label: 'Праздник за норму', description: 'Вспышка в виджетах при выполнении нормы часов' }
] as const
</script>

<template>
  <ui-card
    title="Сезонная тема"
    :ui="{ body: 'sm:p-0 p-0' }"
  >
    <div class="divide-y divide-default">
      <label class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Сезонная тема</p>
          <p
            class="text-xs text-muted"
            aria-hidden="true"
          >
            Праздничное оформление интерфейса
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <u-switch
            v-model="seasonalThemeActive"
            :disabled="!isHaveThemeType"
          />
          <span
            class="text-sm italic"
            :class="isHaveThemeType ? 'animate-pulse' : 'opacity-40'"
          >
            {{ isHaveThemeType ? '*Тык*' : 'Пока недоступно ._.' }}
          </span>
        </div>
      </label>

      <div
        v-if="isHaveThemeType && seasonalThemeActive"
        class="space-y-1 border-t border-muted px-2 py-1.5 lg:px-4 lg:py-3"
      >
        <label
          v-for="option in THEME_ENTITY_OPTIONS"
          :key="option.key"
          class="flex items-center justify-between gap-4 py-1"
        >
          <div class="min-w-0">
            <p class="text-sm">{{ option.label }}</p>
            <p
              class="text-xs text-muted"
              aria-hidden="true"
            >
              {{ option.description }}
            </p>
          </div>
          <u-switch
            v-model="themeEntities[option.key]"
            class="shrink-0"
          />
        </label>
      </div>
    </div>
  </ui-card>
</template>
