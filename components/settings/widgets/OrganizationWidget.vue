<script setup lang="ts">
import SettingsOrganizationIdModal from '~/components/settings/modals/SettingsOrganizationIdModal.vue'
import { useSiteSettingsStore } from '~/stores/site-settings'
import UiCard from '~/components/ui/UiCard.vue'
import { useClipboard } from '@vueuse/core'
import { HEROICONS } from '~/helpers/static/heroicons'

const { organizationId } = storeToRefs(useSiteSettingsStore())

const toast = useToast()
const modal = useModal()

const { copy, copied, isSupported } = useClipboard({ source: organizationId })

function copyWithToast() {
	copy()
	toast.add({
		title: 'Скопировано',
		color: 'green'
	})
}

function openModal() {
	modal.open(SettingsOrganizationIdModal)
}
</script>

<template>
	<UiCard title="ID Организации">
		<div class="flex gap-4 items-center">
			<div class="text-accent overflow-hidden truncate">
				{{ organizationId || 'Пусто' }}
			</div>
			<UTooltip
				v-if="organizationId && isSupported"
				:text="copied ? '' : 'Скопировать'"
			>
				<UButton
					variant="link"
					:color="copied ? 'primary' : 'white'"
					:icon="copied ? HEROICONS.CHECK : HEROICONS.CLIPBOARD_DOCUMENT_SOLID"
					class="hover:text-primary"
					:disabled="copied"
					@click="copyWithToast"
				/>
			</UTooltip>
		</div>

		<template #footer>
			<UButton
				:label="organizationId ? 'Изменить' : 'Добавить'"
				@click="openModal"
			/>
		</template>
	</UiCard>
</template>
