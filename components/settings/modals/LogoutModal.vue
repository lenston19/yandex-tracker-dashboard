<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"
import { useSiteSettingsStore } from "~/stores/site-settings"

const siteSettingsStore = useSiteSettingsStore()
const authStore = useAuthStore()
const model = defineModel<boolean>()

const closeDialog = () => {
	model.value = false
}

const logout = () => {
	siteSettingsStore.clearState()
	authStore.clearState()
	closeDialog()
}
</script>

<template>
	<UModal v-model="model">
		<UCard>
			<template #header>
				<div class="text-xl">Выйти из аккаунта?</div>
			</template>
			<template #footer>
				<div class="flex gap-4 justify-end">
					<UButton
						@click="closeDialog"
						label="Закрыть"
					/>
					<UButton
						@click="logout"
						color="red"
						label="Выйти"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<style scoped lang="scss"></style>
