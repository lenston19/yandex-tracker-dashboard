<script setup lang="ts">
import { useSiteSettingsStore } from '~/store/site-settings'
import YTInput from '~/components/ui/YTInput.vue'

const siteSettingsStore = useSiteSettingsStore()
const model = defineModel<boolean>()
const organizationId = ref<string>('')
const error = ref<string>('')

const saveId = () => {
	if (organizationId.value.length === 0) {
		error.value = 'Поле должно быть обязательно заполнено'
	} else {
		siteSettingsStore.setOrganizationId(organizationId.value)
		model.value = false
	}
}

watch(organizationId, (newVal: string) => {
	if (newVal.length > 0) {
		error.value = ''
	} else {
		error.value = 'Поле должно быть обязательно заполнено'
	}
})

onMounted(() => {
	organizationId.value = siteSettingsStore.organizationId
})
</script>

<template>
	<UModal v-model="model" prevent-close>
		<UCard>
			<template #header>
				<div class="text-xl">
					Для дальнейшей работы с приложением нужен ID организации
				</div>
			</template>
			<YTInput
				v-model="organizationId"
				label="Идентификатор"
				:error-text="error"
				required
				size="sm"
				color="white"
			/>

			<div class="mt-3">
				<a
					href="https://tracker.yandex.ru/admin/orgs"
					target="_blank"
					class="text-base text-primary underline"
				>
					Ключ можно найти здесь :)
				</a>
			</div>


			<template #footer>
				<UButton @click="saveId" label="Сохранить" />
			</template>
		</UCard>
	</UModal>
</template>



<style scoped lang="scss">

</style>
