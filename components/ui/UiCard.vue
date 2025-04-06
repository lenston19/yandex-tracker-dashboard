<script setup lang="ts">
const props = defineProps<{
	noPaddingBody?: boolean
	title?: string
}>()

const ui = computed(() => ({
	body: {
		padding: props.noPaddingBody ? '' : 'px-4 py-5 sm:p-6'
	}
}))
</script>

<template>
	<UCard :ui="ui">
		<template
			v-if="title || $slots.header"
			#header
		>
			<div
				v-if="title"
				class="text-xl"
				v-html="title"
			/>
			<slot
				v-else-if="$slots.header"
				name="header"
			></slot>
		</template>
		<slot></slot>
		<template
			v-if="$slots.footer"
			#footer
		>
			<slot name="footer"></slot>
		</template>
	</UCard>
</template>
