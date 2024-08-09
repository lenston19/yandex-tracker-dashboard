<script setup lang="ts">
const props = defineProps<{
	label?: string,
	errorText?: string,
	disabled?: boolean
}>()

const model = defineModel<string>()

const uiSettings = computed(() => {
	return {
		color: {
			red: 'shadow-sm bg-red-300 dark:bg-red-900 text-red-900 dark:text-red ring-1 ring-inset ring-red-300 dark:ring-red-700 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400'
		}
	}
})
</script>

<template>
	<div
		class="yt-input"
		:class="{
			'cursor-not-allowed': disabled
		}"
	>
		<div v-if="label" class="yt-input__label text-sm mb-2">
			{{ label }}
		</div>
		<UInput
			v-model="model"
			v-bind="$attrs"
			:color="errorText && 'red'"
			:ui="uiSettings"
		/>
		<div v-if="errorText" class="yt-input__error text-xs text-red-600 mt-1">
			{{ errorText }}
		</div>
	</div>
</template>

<style scoped lang="scss">

</style>
