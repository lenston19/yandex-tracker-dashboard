<script setup lang="ts">
import { HEROICONS } from '~/helpers/static/heroicons'
</script>

<template>
	<div class="flex flex-col items-center gap-4 justify-center min-h-32">
		<UIcon
			:name="HEROICONS.CIRCLE_STACK_20_SOLID"
			class="w-6 h-6"
		/>
		<div class="text-h4">Нет данных</div>
	</div>
</template>
