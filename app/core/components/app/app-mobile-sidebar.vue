<script setup lang="ts">
import ModalSlideover from '~/core/components/modal/modal-slideover.vue'
import AppSidebarContent from './app-sidebar-content.vue'
import AppLogo from './app-logo.vue'
import { HEROICONS } from '~/core/constants/heroicons'

const modelValue = defineModel<boolean>({ default: false })
</script>

<template>
  <modal-slideover
    v-model="modelValue"
    :ui="{ body: 'p-0' }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <app-logo />
        <u-button
          :icon="HEROICONS.X_MARK"
          size="sm"
          square
          @click="modelValue = false"
        />
      </div>
    </template>

    <app-sidebar-content />
  </modal-slideover>
</template>
