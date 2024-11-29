<script setup lang="ts">
import { storeToRefs } from "pinia"
import SettingsGoldModal from "~/components/settings/modals/SettingsGoldModal.vue"
import { formatRUB } from "~/helpers/static/format-money"
import { useSiteSettingsStore } from "~/store/site-settings"

const { gold } = storeToRefs(useSiteSettingsStore())

const dialog = ref<boolean>(false)
</script>

<template>
	<SettingsGoldModal v-model="dialog" />

	<UCard>
		<template #header>
			<div class="text-xl">Ставка</div>
		</template>

		<div class="text-accent overflow-hidden truncate">
			{{ formatRUB(gold) || "Пусто" }}
		</div>

		<template #footer>
			<UButton
				@click="dialog = true"
				label="Изменить"
			/>
		</template>
	</UCard>
</template>
