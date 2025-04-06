<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'
import UiTimeZoneSelect from '~/components/ui/UiTimeZoneSelect.vue'

const model = defineModel<boolean>({ default: false })
</script>

<template>
	<UModal v-model="model">
		<UiCard>
			<template #header>
				<div class="flex flex-col gap-3">
					<div class="text-lg">Выберите временную зону</div>
					<UDivider />
					<div class="italic flex flex-col gap-2 text-base">
						* Дата/время будет отображаться согласно этой настройке
						<div class="text-red-300">** Данные будут запрашиваться по UTC вне зависимости от этой настройки</div>
					</div>
				</div>
			</template>
			<UiTimeZoneSelect />
		</UiCard>
	</UModal>
</template>
