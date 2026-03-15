<script setup lang="ts">
import UiCard from '~/core/components/ui/ui-card.vue'
import { useSiteSettingsStore } from '~/modules/settings'
import { TIME_ZONE_LIST } from '../models/constants/time-zone'

const siteSettingsStore = useSiteSettingsStore()
const { timeZone, seasonalTheme, isHaveThemeType } = storeToRefs(siteSettingsStore)
</script>

<template>
  <ui-card
    title="Отображение"
    :ui="{ body: 'sm:p-0 p-0' }"
  >
    <div class="divide-y divide-default">
      <div class="flex justify-between gap-4 px-2 py-1.5 max-lg:flex-col lg:items-center lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Временная зона</p>
          <p class="text-xs text-muted">
            Дата и время отображаются согласно этой настройке. Данные запрашиваются по UTC.
          </p>
        </div>
        <u-select-menu
          :model-value="timeZone"
          :items="TIME_ZONE_LIST"
          class="w-48 shrink-0"
          @update:model-value="siteSettingsStore.setTimeZone"
        />
      </div>

      <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Сезонная тема</p>
          <p class="text-xs text-muted">Праздничное оформление интерфейса</p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <u-switch
            v-model="seasonalTheme.active"
            :disabled="!isHaveThemeType"
          />
          <span
            class="text-sm italic"
            :class="isHaveThemeType ? 'animate-pulse' : 'opacity-40'"
          >
            {{ isHaveThemeType ? '*Тык*' : 'Пока недоступно ._.' }}
          </span>
        </div>
      </div>
    </div>
  </ui-card>
</template>
