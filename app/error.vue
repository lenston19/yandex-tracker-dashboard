<script setup lang="ts">
import { SITEMAP } from './core/utils/router/sitemap'

const props = defineProps<{
  error?: {
    statusCode?: number
    message?: string
  }
}>()

const errorCode = props.error?.statusCode ?? 404
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center bg-default p-6 text-center">
    <img
      src="/gif/Hello There.gif"
      alt="error illustration"
      class="mx-auto mb-8 w-full max-w-184"
    />

    <div class="animate-bounce text-[96px] font-extrabold text-secondary-600">
      {{ errorCode }}
    </div>

    <h1 class="mt-4 text-xl font-bold text-default">Страница не найдена</h1>

    <p class="mt-2 max-w-md text-default">
      К сожалению, страница, которую вы ищете, не существует или была перемещена.
    </p>

    <u-button
      size="xl"
      color="secondary"
      class="mt-8"
      @click="navigateTo({ name: SITEMAP.settings.route.name })"
    >
      Вернуться на главную
    </u-button>
  </div>
</template>
