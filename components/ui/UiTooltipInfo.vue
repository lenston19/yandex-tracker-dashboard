<script setup lang="ts">
import { HEROICONS } from '~/helpers/static/heroicons'

defineProps<{
	text?: string
}>()
</script>

<template>
	<UTooltip
		:ui="{
			base: '[@media(pointer:coarse)]:block !overflow-visible !text-wrap h-fit text-base'
		}"
	>
		<template #text>
			<span
				v-if="text"
				v-html="text"
			/>
			<slot v-else-if="$slots.default" />
		</template>
		<UIcon
			:name="HEROICONS.INFORMATION_CIRCLE"
			class="w-5 h-5 cursor-help"
		/>
	</UTooltip>
</template>
