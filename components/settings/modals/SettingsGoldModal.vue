<script setup lang="ts">
import { useSiteSettingsStore } from '~/store/site-settings'
import { number, object } from 'yup'
import { storeToRefs } from 'pinia';

const { gold } = storeToRefs(useSiteSettingsStore())

const model = defineModel<boolean>()

const schema = object({
	money: number()
		.transform((value: number | string) => (Number.isNaN(value) || typeof +value !== 'number' ? null : value))
		.min(0, 'Минимальное значение 0')
		.required('Поле обязательное'),
})

const state = reactive({
	money: gold.value >= 0 ? gold.value : 8
})

const save = () => {
	gold.value = state.money
	model.value = false
}
</script>

<template>
	<UModal v-model="model">
		<UCard>
			<template #header>
				<div class="text-lg">
					Введите ставку
				</div>
			</template>

			<UForm
				:schema="schema"
				:state="state"
				@submit="save"
				class="space-y-4"
			>
				<UFormGroup
					label="Ставка"
					name="money"
				>
					<UInput v-model.number="state.money" type="number" color="primary" variant="outline" />
				</UFormGroup>
				<UButton
					label="Сохранить"
					type="submit"
				/>
			</UForm>
		</UCard>
	</UModal>
</template>
