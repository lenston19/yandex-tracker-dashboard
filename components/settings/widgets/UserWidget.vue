<script setup lang="ts">
import { storeToRefs } from "pinia"
import LogoutModal from "~/components/settings/modals/LogoutModal.vue"
import { useAuthStore } from "~/store/auth"

const { userName, mySelf, userAvatarUrl } = storeToRefs(useAuthStore())

const dialog = ref<boolean>(false)
</script>

<template>
	<LogoutModal v-model="dialog" />

	<UCard v-if="mySelf">
		<template #header>
			<div class="text-xl">
				<!-- TODO: Обновление данных с аккаунта -->
				Пользователь
			</div>
		</template>

		<div class="flex items-center gap-4">
			<UAvatar :src="userAvatarUrl" :alt="userName" />
			<div class="text-accent overflow-hidden truncate">
				{{ userName || "Пусто" }}
			</div>
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

<style scoped lang="scss"></style>
