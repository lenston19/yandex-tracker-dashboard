<script setup lang="ts">
import { HEROICONS } from '~/helpers/static/heroicons'
import { useSiteSettingsStore } from '~/stores/site-settings'
import { useAuthStore } from '~/stores/auth'
import { pages } from '~/helpers/static/menu'
import { useToggle } from '@vueuse/core'

const { login } = storeToRefs(useAuthStore())
const { organizationId } = storeToRefs(useSiteSettingsStore())

const [isOpen, toggle] = useToggle(false)
</script>

<template>
	<UButton
		class="flex"
		:icon="HEROICONS.BARS_3"
		@click="toggle(true)"
	/>
	<USlideover
		v-if="organizationId && login"
		v-model="isOpen"
		side="left"
		:ui="{
			height: 'max-h-fit'
		}"
	>
		<div class="p-4">
			<UVerticalNavigation
				:links="pages"
				@click="toggle(false)"
			/>
		</div>
	</USlideover>
</template>
