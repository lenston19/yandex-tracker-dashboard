<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSiteSettingsStore } from '~/stores/site-settings'
import { string, object } from 'yup'

const { organizationId } = storeToRefs(useSiteSettingsStore())
const model = defineModel<boolean>()

const schema = object({
	id: string().required('Поле обязательное')
})

const state = reactive({
	id: !!organizationId.value ? organizationId.value : ''
})

const save = () => {
	organizationId.value = state.id
	model.value = false
}
</script>

<template>
	<UModal
		v-model="model"
		prevent-close
	>
		<UCard>
			<template #header>
				<div class="text-xl">
					Для дальнейшей работы с приложением нужен ID организации
				</div>
			</template>
			<UForm
				:schema="schema"
				:state="state"
				@submit="save"
				class="space-y-4"
			>
				<UFormGroup
					label="Идентификатор"
					name="id"
				>
					<UInput
						v-model="state.id"
						color="primary"
						variant="outline"
					/>
				</UFormGroup>

				<div class="flex justify-between">
					<UButton
						to="https://tracker.yandex.ru/admin/orgs"
						target="_blank"
						variant="link"
						class="p-0"
						label="Ключ можно найти здесь :)"
					/>
					<UButton
						label="Сохранить"
						type="submit"
					/>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>



<style scoped lang="scss"></style>
