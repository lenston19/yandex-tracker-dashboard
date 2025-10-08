<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useAuthStore } from '~/core/store/use-auth-store'
import { SITEMAP } from '~/core/utils/router/sitemap/index'
import { useTimeoutFn } from '@vueuse/core'

useHead({
  title: SITEMAP.auth.name
})

definePageMeta({
  layout: 'empty',
  middleware: ['empty-organization-id']
})

const route = useRoute()
const router = useRouter()
const siteSettingsStore = useSiteSettingsStore()
const authStore = useAuthStore()
const { accessToken } = storeToRefs(siteSettingsStore)
const toast = useToast()

onMounted(async () => {
  const accessTokenFromRoute = new URLSearchParams(route.hash.slice(1)).get('access_token')
  if (accessTokenFromRoute) {
    accessToken.value = accessTokenFromRoute

    if (accessToken.value) {
      toast.add({ title: 'Авторизован' })
      await authStore.refreshMySelf()
      useTimeoutFn(() => {
        navigateTo({ name: SITEMAP.settings.route.name })
      }, 1000)
    } else {
      toast.add({ title: 'Ошибка' })
    }
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      class="text-2xl"
      :class="{ loading: !accessToken }"
    >
      {{ accessToken ? 'Успешно' : 'Загрузка' }}
    </div>

    <u-button
      v-if="accessToken"
      label="К настройкам"
      color="success"
      class="w-fit"
      @click="router.push({ name: SITEMAP.settings.route.name })"
    />
  </div>
</template>

<style scoped>
.loading:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(3, end) 1.4s infinite;
  animation: ellipsis steps(3, end) 1.4s infinite;
  content: '\2026';
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 40px;
  }
}
</style>
