<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { HEROICONS } from '~/core/constants/heroicons'
import { ISSUE_STATUS_OPTIONS, ISSUE_PRIORITY_OPTIONS } from '~/core/constants/issues'
import UiCard from '~/core/components/ui/ui-card.vue'

const statuses = defineModel<string[]>('statuses', { required: true })
const priority = defineModel<string | null>('priority', { required: true })
const search = defineModel<string>('search', { default: '' })

const emit = defineEmits<{ apply: [] }>()

const statusesModel = computed({
  get: () => ISSUE_STATUS_OPTIONS.filter(o => statuses.value.includes(o.value)),
  set: val => {
    statuses.value = val.map(o => o.value)
  }
})

const { isLoading } = defineProps<{ isLoading: boolean }>()

const searchInput = ref('')
const updateSearch = useDebounceFn((val: string) => {
  search.value = val
}, 300)
watch(searchInput, updateSearch)
</script>

<template>
  <ui-card title="Фильтрация">
    <div class="flex flex-wrap items-end gap-4">
      <u-form-field
        label="Поиск"
        class="w-full lg:w-64"
      >
        <u-input
          v-model="searchInput"
          placeholder="Название или ключ задачи"
          class="w-full"
          :trailing-icon="searchInput ? undefined : HEROICONS.MAGNIFYING_GLASS"
        >
          <template
            v-if="searchInput"
            #trailing
          >
            <u-button
              :icon="HEROICONS.X_MARK"
              variant="ghost"
              size="xs"
              square
              @click="searchInput = ''"
            />
          </template>
        </u-input>
      </u-form-field>

      <u-form-field
        label="Статус"
        class="w-full lg:w-56"
      >
        <u-select-menu
          v-model="statusesModel"
          :items="ISSUE_STATUS_OPTIONS"
          multiple
          class="w-full"
          placeholder="Выберите статусы"
        />
      </u-form-field>

      <u-form-field
        label="Приоритет"
        class="w-full lg:w-44"
      >
        <u-select
          v-model="priority"
          :items="ISSUE_PRIORITY_OPTIONS"
          value-key="value"
          label-key="label"
          class="w-full"
        />
      </u-form-field>

      <slot name="extra" />

      <div class="flex items-end gap-2">
        <u-button
          label="Применить"
          size="md"
          :loading="isLoading"
          @click="emit('apply')"
        />
        <slot name="actions" />
      </div>
    </div>
  </ui-card>
</template>
