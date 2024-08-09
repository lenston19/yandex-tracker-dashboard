<script lang="ts" setup>
import { Settings } from 'luxon';

Settings.defaultZone = 'Europe/Moscow';
Settings.defaultLocale = 'ru';
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>
