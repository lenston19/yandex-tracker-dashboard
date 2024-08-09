<script setup lang="ts">
import { storeToRefs } from 'pinia';
import LogoutModal from '~/components/settings/modals/LogoutModal.vue'
import { useAuthStore } from '~/store/auth';

const { userName, mySelf } = storeToRefs(useAuthStore())
const dialog = ref<boolean>(false)
</script>

<template>
	<LogoutModal
		v-model="dialog"
	/>

	<UCard v-if="mySelf" :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
		<template #header>
			<div class="text-xl">
				Пользователь
			</div>
		</template>

		<div class="text-accent overflow-hidden truncate">
			{{ userName || 'Пусто' }}
		</div>
		<template #footer>
			<UButton
				@click="dialog = true"
				color="red"
				label="Выйти"
				icon="i-heroicons-arrow-right-start-on-rectangle"
			/>
			</template>
	</UCard>
</template>

<style scoped lang="scss">

</style>
