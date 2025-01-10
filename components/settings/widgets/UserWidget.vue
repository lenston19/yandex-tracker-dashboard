<script setup lang="ts">
import LogoutModal from "~/components/settings/modals/LogoutModal.vue"
import { useAuthStore } from "~/stores/auth"
import { HEROICONS } from "~/helpers/static/heroicons"
import UiCard from '~/components/ui/UiCard.vue'

const authStore = useAuthStore()

const { userName, mySelf, userAvatarUrl, isLoading } = storeToRefs(authStore)

const modal = useModal()

function openModal() {
	modal.open(LogoutModal)
}
</script>

<template>
	<UiCard v-if="mySelf">
		<template #header>
			<div class="flex items-center gap-4">
				<div class="text-xl">
					Пользователь
				</div>
				<UTooltip text="Обновить данные о пользователе">
					<UButton
						:icon="HEROICONS.ARROW_PATH"
						:loading="isLoading"
						@click="authStore.refreshMySelf"
					/>
				</UTooltip>
			</div>
		</template>

		<div class="flex items-center gap-4">
			<UAvatar
				:src="userAvatarUrl"
				:alt="userName"
			/>
			<div class="text-accent overflow-hidden truncate">
				{{ userName || "Вы" }}
			</div>
		</div>
		<template #footer>
			<UButton
				@click="openModal"
				color="red"
				:loading="isLoading"
				label="Выйти"
				:icon="HEROICONS.ARROW_RIGHT_START_ON_RECTANGLE"
			/>
		</template>
	</UiCard>
</template>
