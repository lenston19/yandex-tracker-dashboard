<script setup lang="ts">
import { useAuthStore } from '~/core/store/use-auth-store'
import { HEROICONS } from '~/core/constants/heroicons'
import { useModal } from 'vue-final-modal'
import AppLogin from '~/core/components/app/app-login.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { useSiteSettingsStore } from '../store/use-site-settings-store'

const authStore = useAuthStore()

const { userName, mySelf, userAvatarUrl, isLoading } = storeToRefs(authStore)
const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())

const { open } = useModal({
  component: defineAsyncComponent(() => import('./modals/logout-modal.vue'))
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
    :ui="{
      description: 'text-sm'
    }"
  >
    <div class="flex flex-col gap-2 text-sm font-light">
      <div>Вы не авторизованы. Чтобы получить доступ к информации о пользователе — войдите в систему.</div>
      <div>Так же введите <span class="font-bold">ID организации</span>, если он еще не заполнен</div>
    </div>
    <template
      v-if="!accessToken && !!organizationId"
      #footer
    >
      <app-login />
    </template>
  </ui-card>
</template>
