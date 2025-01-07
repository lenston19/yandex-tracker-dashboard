<script lang="ts" setup>
import { Settings } from 'luxon'

Settings.defaultZone = 'Europe/Moscow'
Settings.defaultLocale = 'ru'

useHead({
	title: 'YandexTracker Dashboard'
})
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<ClientOnly>
		<UNotifications />
		<UModals />
	</ClientOnly>
</template>
