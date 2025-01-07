<script setup lang="ts">
import LogoutModal from "~/components/settings/modals/LogoutModal.vue"
import { useAuthStore } from "~/stores/auth"
import { HEROICONS } from "~/helpers/static/heroicons"
import UiCard from '~/components/ui/UiCard.vue'

const authStore = useAuthStore()

const { userName, mySelf, userAvatarUrl, isLoading } = storeToRefs(authStore)

const dialog = ref<boolean>(false)
</script>

<template>
	<LogoutModal v-model="dialog" />

	<UiCard v-if="mySelf">
		<template #header>
			<div class="flex items-center gap-4">
				<div class="text-xl">
					Пользователь
				</div>
				<UButton
					:icon="HEROICONS.ARROW_PATH"
					:loading="isLoading"
					@click="authStore.refreshMySelf"
				/>
			</div>

		</template>

		<div class="flex items-center gap-4">
			<UAvatar
				:src="userAvatarUrl"
				:alt="userName"
			/>
			<div class="text-accent overflow-hidden truncate">
				{{ userName || "Пусто" }}
			</div>
		</div>
		<template #footer>
			<UButton
				@click="dialog = true"
				color="red"
				:loading="isLoading"
				label="Выйти"
				:icon="HEROICONS.ARROW_RIGHT_START_ON_RECTANGLE"
			/>
		</template>
	</UiCard>
</template>
