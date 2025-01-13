<script setup lang="ts">
import { SITEMAP } from '~/helpers/router/sitemap/index'

useHead({
	title: SITEMAP.changelog.name
})
</script>

<template>
	<UContainer>
		<ContentDoc class="prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl">
			<template #not-found>
				<div class="text-h4">Документ не найден</div>
			</template>
		</ContentDoc>
	</UContainer>
</template>
