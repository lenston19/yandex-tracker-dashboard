<script setup lang="ts">
import { useSiteSettingsStore } from "~/stores/site-settings"

definePageMeta({
	layout: "empty",
	middleware: [
		'empty-organization-id'
	]
})

const route = useRoute()
const router = useRouter()
const siteSettingsStore = useSiteSettingsStore()
const { accessToken } = storeToRefs(siteSettingsStore)
const toast = useToast()

onMounted(() => {
	const accessTokenFromRoute = new URLSearchParams(route.hash.slice(1)).get(
		"access_token"
	)
	if (accessTokenFromRoute) {
		siteSettingsStore.setAccessToken(accessTokenFromRoute)
		if (accessToken.value) {
			toast.add({ title: "Авторизован" })
		} else {
			toast.add({ title: "Ошибка" })
		}
	}
})
</script>

<template>
	<div class="flex flex-col items-center">
		<div
			class="text-2xl"
			:class="{
				'loading': accessToken
			}"
		>
			{{ accessToken ? 'Успешно' : 'Загрузка' }}
		</div>

		<UButton
			v-if="accessToken"
			label="К настройкам"
			color="primary"
			class="mt-4 w-fit"
			@click="router.push({ name: 'settings' })"
		/>
	</div>
</template>

<style scoped lang="scss">
.loading:after {
	overflow: hidden;
	display: inline-block;
	vertical-align: bottom;
	-webkit-animation: ellipsis steps(3, end) 1.4s infinite;
	animation: ellipsis steps(3, end) 1.4s infinite;
	content: "\2026";
	width: 0px;
}

@keyframes ellipsis {
	to {
		width: 40px;
	}
}
</style>
