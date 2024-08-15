<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSiteSettingsStore } from '~/store/site-settings'

const siteSettingsStore = useSiteSettingsStore()
const { organizationId } = storeToRefs(siteSettingsStore)
const model = defineModel<boolean>()
const organizationIdModel = ref<string>('')
const error = ref<string>('')

const saveId = () => {
	if (organizationIdModel.value.length === 0) {
		error.value = 'Поле должно быть обязательно заполнено'
	} else {
		siteSettingsStore.setOrganizationId(organizationIdModel.value)
		model.value = false
	}
}

watch(organizationIdModel, (newVal: string) => {
	if (newVal.length > 0) {
		error.value = ''
	} else {
		error.value = 'Поле должно быть обязательно заполнено'
	}
})

watch(organizationId, () => {
	organizationIdModel.value = organizationId.value
})

onMounted(() => {
	organizationIdModel.value = organizationId.value
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
			<UFormGroup label="Идентификатор" :error="error">
				<UInput
					v-model="organizationIdModel"
					required
					size="sm"
					color="white"
				/>
			</UFormGroup>
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
