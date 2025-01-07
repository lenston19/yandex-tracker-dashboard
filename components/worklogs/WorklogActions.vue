<script setup lang="ts">
import { HEROICONS } from "~/helpers/static/heroicons"

export interface WorklogActionsProps {
	next?: () => Promise<void> | void
	prev?: () => Promise<void> | void
	refresh: () => Promise<void> | void
	loading: boolean
}

defineProps<WorklogActionsProps>()
</script>

<template>
	<div class="flex items-center gap-4">
		<div
			v-if="prev || next"
			class="flex items-center"
		>
			<UButton
				v-if="prev"
				:icon="HEROICONS.ARROW_LEFT"
				variant="link"
				:loading="loading"
				@click="prev"
			/>
			<UButton
				v-if="next"
				:icon="HEROICONS.ARROW_RIGHT"
				variant="link"
				:loading="loading"
				@click="next"
			/>
		</div>
		<UButton
			:icon="HEROICONS.ARROW_PATH"
			:loading="loading"
			@click="refresh"
		/>
	</div>
</template>
