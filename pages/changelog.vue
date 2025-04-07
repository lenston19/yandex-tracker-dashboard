<script setup lang="ts">
import { SITEMAP } from '~/helpers/router/sitemap/index'

useHead({
	title: SITEMAP.changelog.name
})

const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
	return queryCollection('content').path(route.path).first()
})
</script>

<template>
	<UContainer>
		<ContentRenderer
			v-if="page"
			:value="page"
			class="prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl"
		/>

		<div
			v-else
			class="text-h4"
		>
			Документ не найден
		</div>
	</UContainer>
</template>
