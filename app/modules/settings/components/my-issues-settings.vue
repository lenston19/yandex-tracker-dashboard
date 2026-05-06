<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import UiCard from '~/core/components/ui/ui-card.vue'
import { HEROICONS } from '~/core/constants/heroicons'
import { ISSUE_STATUS_OPTIONS } from '~/core/constants/issues'

const ACTIVE_STATUS_OPTIONS = ISSUE_STATUS_OPTIONS.filter(o =>
  ['open', 'rediscovered', 'inProgress', 'needInfo'].includes(o.value)
)

type RoleKey = 'assignee' | 'reviewer' | 'qaEngineer'
type DisplayKey = 'priority' | 'status' | 'assignee' | 'reviewer' | 'qaEngineer'

const ROLE_OPTIONS: { key: RoleKey; label: string }[] = [
  { key: 'assignee', label: 'Исполнитель' },
  { key: 'reviewer', label: 'Ревьюер' },
  { key: 'qaEngineer', label: 'QA-инженер' }
]

const DISPLAY_OPTIONS: { key: DisplayKey; label: string }[] = [
  { key: 'priority', label: 'Приоритет' },
  { key: 'status', label: 'Статус' },
  { key: 'assignee', label: 'Исполнитель' },
  { key: 'reviewer', label: 'Ревьюер' },
  { key: 'qaEngineer', label: 'QA-инженер' }
]

const { myIssues } = storeToRefs(useSiteSettingsStore())

const selectedStatuses = computed({
  get: () => ACTIVE_STATUS_OPTIONS.filter(o => myIssues.value.statuses.includes(o.value)),
  set: val => {
    myIssues.value.statuses = val.map(o => o.value)
  }
})
</script>

<template>
  <ui-card
    title="Мои задачи"
    :ui="{ body: 'sm:p-0 p-0' }"
  >
    <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
      <div class="min-w-0">
        <p class="text-sm font-medium">Показывать виджет</p>
        <p class="text-xs text-muted">Список активных задач на дашборде</p>
      </div>
      <u-switch
        v-model="myIssues.show"
        class="shrink-0"
        :checked-icon="HEROICONS.CHECK_20_SOLID"
        :unchecked-icon="HEROICONS.X_MARK_20_SOLID"
      />
    </div>
    <u-separator />
    <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
      <div class="min-w-0">
        <p class="text-sm font-medium">Статусы задач</p>
        <p class="text-xs text-muted">Какие статусы получать в виджете</p>
      </div>
      <u-select-menu
        v-model="selectedStatuses"
        :items="ACTIVE_STATUS_OPTIONS"
        multiple
        class="w-48 shrink-0"
        placeholder="Выберите статусы"
      />
    </div>
    <u-separator />
    <div class="px-2 py-1.5 lg:px-4 lg:py-3">
      <p class="mb-2 text-sm font-medium">Искать задачи по роли</p>
      <div class="flex flex-col gap-1.5">
        <div
          v-for="item in ROLE_OPTIONS"
          :key="item.key"
          class="flex items-center justify-between gap-4"
        >
          <p class="text-sm text-muted">{{ item.label }}</p>
          <u-switch
            v-model="myIssues.roles[item.key]"
            size="sm"
            :checked-icon="HEROICONS.CHECK_20_SOLID"
            :unchecked-icon="HEROICONS.X_MARK_20_SOLID"
          />
        </div>
      </div>
    </div>
    <u-separator />
    <div class="px-2 py-1.5 lg:px-4 lg:py-3">
      <p class="mb-2 text-sm font-medium">Элементы отображения</p>
      <div class="flex flex-col gap-1.5">
        <div
          v-for="item in DISPLAY_OPTIONS"
          :key="item.key"
          class="flex items-center justify-between gap-4"
        >
          <p class="text-sm text-muted">{{ item.label }}</p>
          <u-switch
            v-model="myIssues.display[item.key]"
            size="sm"
            :checked-icon="HEROICONS.CHECK_20_SOLID"
            :unchecked-icon="HEROICONS.X_MARK_20_SOLID"
          />
        </div>
      </div>
    </div>
  </ui-card>
</template>
