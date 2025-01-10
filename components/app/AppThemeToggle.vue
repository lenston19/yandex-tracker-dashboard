<script setup lang="ts">
import { HEROICONS } from "~/helpers/static/heroicons"

const colorMode = useColorMode()

const isDark = computed({
	get: () => colorMode.value === "dark",
	set: (_) =>
		(colorMode.preference = colorMode.value === "dark" ? "light" : "dark"),
})

const icon = computed(() => isDark.value ? HEROICONS.MOON_20_SOLID : HEROICONS.SUN_20_SOLID)
</script>

<template>
	<ClientOnly>
		<UButton
			:icon="icon"
			color="gray"
			variant="ghost"
			@click="isDark = !isDark"
		/>
	</ClientOnly>
</template>
