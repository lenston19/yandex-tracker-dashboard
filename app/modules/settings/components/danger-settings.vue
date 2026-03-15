<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import { useAuthStore } from '~/core/store/use-auth-store'
import { HEROICONS } from '~/core/constants/heroicons'
import UiCard from '~/core/components/ui/ui-card.vue'

const { isLoading: isAuthLoading } = storeToRefs(useAuthStore())

const { open: openLogoutModal } = useModal({
  component: defineAsyncComponent(() => import('./modals/logout-modal.vue'))
})
</script>

<template>
  <ui-card :ui="{ body: 'sm:p-0 p-0' }">
    <template #header>
      <span class="text-base font-semibold text-error">Опасная зона</span>
    </template>

    <div class="divide-y divide-error/20">
      <div class="flex items-center justify-between gap-4 px-2 py-1.5 lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Выйти из аккаунта</p>
          <p class="text-xs text-muted">Данные авторизации будут удалены</p>
        </div>
        <u-button
          class="shrink-0"
          color="error"
          variant="outline"
          size="sm"
          :loading="isAuthLoading"
          label="Выйти"
          :icon="HEROICONS.ARROW_RIGHT_START_ON_RECTANGLE"
          @click="openLogoutModal()"
        />
      </div>
    </div>
  </ui-card>
</template>
