<script setup lang="ts">
import { useAuthStore } from '~/store/auth';

definePageMeta({
	layout: 'empty'
})

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore()

onMounted(() => {
	const accessToken = new URLSearchParams(route.hash.slice(1)).get('access_token')
	if (accessToken) {
		authStore.setAccessToken(accessToken)
	}
});
</script>

<template>

	<div class="flex flex-col items-center">
		<div v-if="authStore.accessToken" class="text-2xl">
			Успешно
		</div>
		<div v-else class="text-2xl">
			Отсутствует токен
		</div>

		<UButton
			label="К настройкам"
			color="primary"
			class="mt-4 w-fit"
			@click="router.push({ name: 'settings' })"
		/>
	</div>
</template>

<style scoped>
</style>
