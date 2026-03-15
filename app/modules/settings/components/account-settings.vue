<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import { useClipboard } from '@vueuse/core'
import { useAuthStore } from '~/core/store/use-auth-store'
import { useSiteSettingsStore } from '~/modules/settings'
import { HEROICONS } from '~/core/constants/heroicons'
import AppUser from '~/core/components/app/app-user.vue'
import AppLogin from '~/core/components/app/app-login.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

const authStore = useAuthStore()
const { mySelf, isLoading: isAuthLoading } = storeToRefs(authStore)

const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

const { copy, copied, isSupported: isClipboardSupported } = useClipboard({ source: organizationId.value! })
const toast = useToast()

function copyOrgId() {
  copy()
  toast.add({ title: 'Скопировано', color: 'success' })
}

const { open: openOrgModal } = useModal({
  component: defineAsyncComponent(() => import('./modals/settings-organization-id-modal.vue'))
})
</script>

<template>
  <ui-card
    title="Аккаунт"
    :ui="{ body: 'sm:p-0 p-0' }"
  >
    <div class="divide-y divide-default">
      <div class="flex justify-between gap-4 px-2 py-1.5 max-lg:flex-col lg:items-center lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">Пользователь</p>
          <p class="text-xs text-muted">Информация об аккаунте Яндекс</p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <template v-if="mySelf">
            <app-user />
            <u-tooltip
              :delay-duration="0"
              text="Обновить"
            >
              <u-button
                variant="ghost"
                size="sm"
                :icon="HEROICONS.ARROW_PATH"
                :loading="isAuthLoading"
                @click="authStore.refreshMySelf()"
              />
            </u-tooltip>
          </template>
          <app-login v-else-if="!accessToken && !!organizationId" />
          <span
            v-else
            class="text-sm text-muted"
          >
            Не авторизован
          </span>
        </div>
      </div>

      <div class="flex justify-between gap-4 px-2 py-1.5 max-lg:flex-col lg:items-center lg:px-4 lg:py-3">
        <div class="min-w-0">
          <p class="text-sm font-medium">ID Организации</p>
          <p class="text-xs text-muted">Используется для запросов к Яндекс Трекеру</p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <span class="max-w-[160px] truncate text-sm text-muted">
            {{ organizationId || 'Не указан' }}
          </span>
          <u-button
            v-if="organizationId && isClipboardSupported"
            variant="ghost"
            size="sm"
            :color="copied ? 'success' : 'neutral'"
            :icon="copied ? HEROICONS.CHECK : HEROICONS.CLIPBOARD_DOCUMENT_SOLID"
            :disabled="copied"
            @click="copyOrgId"
          />
          <u-button
            size="sm"
            :label="organizationId ? 'Изменить' : 'Добавить'"
            @click="openOrgModal()"
          />
        </div>
      </div>
    </div>
  </ui-card>
</template>
