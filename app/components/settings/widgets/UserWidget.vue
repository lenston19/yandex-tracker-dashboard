<script setup lang="ts">
import { useAuthStore } from '~/stores/use-auth-store'
import { HEROICONS } from '~/constants/heroicons'
import { useModal } from 'vue-final-modal'
import AppLogin from '~/components/app/AppLogin.vue'
import UiCard from '~/components/ui/UiCard.vue'

const authStore = useAuthStore()

const { userName, mySelf, userAvatarUrl, isLoading } = storeToRefs(authStore)
const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

const { open } = useModal({
  component: defineAsyncComponent(() => import('~/components/settings/modals/LogoutModal.vue'))
})
</script>

<template>
  <ui-card v-if="mySelf">
    <template #header>
      <div class="flex items-center gap-4">
        <div class="text-xl font-bold">Пользователь</div>
        <u-tooltip
          :delay-duration="0"
          text="Обновить данные о пользователе"
        >
          <u-button
            :icon="HEROICONS.ARROW_PATH"
            :loading="isLoading"
            @click="authStore.refreshMySelf()"
          />
        </u-tooltip>
      </div>
    </template>

    <div class="flex items-center gap-4">
      <u-user
        :name="userName"
        :avatar="{
          src: userAvatarUrl,
          icon: 'i-heroicons-user'
        }"
      />
    </div>

    <template #footer>
      <u-button
        color="error"
        :loading="isLoading"
        label="Выйти"
        :icon="HEROICONS.ARROW_RIGHT_START_ON_RECTANGLE"
        @click="open()"
      />
    </template>
  </ui-card>

  <ui-card
    v-else
    title="Гость"
    description="Вы не авторизованы. Чтобы получить доступ к информации о пользователе — войдите в систему."
    :ui="{
      description: 'text-sm'
    }"
  >
    <template #footer>
      <app-login v-if="!accessToken && !!organizationId" />
    </template>
  </ui-card>
</template>
