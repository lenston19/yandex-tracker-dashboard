<script setup lang="ts">
const config = useRuntimeConfig()

const getUserAccessToken = () => {
  window.open(
    `https://oauth.yandex.ru/authorize?response_type=token&client_id=${config.public.yandexClientId}`,
    '_blank'
  )
}
</script>

<template>
  <u-button
    color="error"
    label="Войти через Яндекс"
    class="h-fit"
    @click="getUserAccessToken"
  />
</template>
