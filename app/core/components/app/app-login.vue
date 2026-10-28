<script setup lang="ts">
const config = useRuntimeConfig()

const oauthUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${config.public.yandexClientId}`
</script>

<template>
  <u-button
    :to="oauthUrl"
    target="_blank"
    rel="noopener"
    color="error"
    label="Войти через Яндекс"
    class="h-fit"
  />
</template>
