<script setup lang="ts">
import { HEROICONS } from "~/helpers/static/heroicons"

defineProps<{
	title: string,
	next: () => Promise<void> | void
	prev: () => Promise<void> | void
	refresh: () => Promise<void> | void
	loading: boolean
}>()
</script>

<template>
	<div class="flex items-center justify-between">
		<div class="text-xl capitalize">
			{{ title }}
		</div>
		<div class="flex items-center gap-4">
			<div class="flex items-center">
				<UButton
					:icon="HEROICONS.ARROW_LEFT"
					variant="link"
					:loading="loading"
					@click="prev"
				/>
				<UButton
					:icon="HEROICONS.ARROW_RIGHT"
					variant="link"
					:loading="loading"
					@click="next"
				/>
			</div>
			<UButton
				:icon="HEROICONS.ARROW_PATH"
				variant="link"
				:loading="loading"
				@click="refresh"
			/>
		</div>
	</div>
</template>
