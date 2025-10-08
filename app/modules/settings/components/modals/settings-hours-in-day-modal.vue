<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { number, object } from 'yup'
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const model = defineModel<boolean>()

const schema = object({
  hours: number()
    .transform((value: number | string) => (Number.isNaN(value) || typeof +value !== 'number' ? null : value))
    .min(0, 'Минимальное значение 0')
    .required('Поле обязательное')
})

const state = reactive({
  hours: hoursInDay.value >= 0 ? hoursInDay.value : 8
})

const save = () => {
  hoursInDay.value = state.hours
  model.value = false
}
</script>

<template>
  <modal-base v-model="model">
    <ui-card
      title="Введите количество часов, которые вы работаете в день"
      :ui="{
        header: 'max-w-[95%]'
      }"
    >
      <u-form
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="save"
      >
        <u-form-field
          label="Часы"
          name="hours"
          class="w-full"
        >
          <u-input
            v-model.number="state.hours"
            type="number"
            color="success"
            variant="outline"
            class="w-full"
          />
        </u-form-field>
        <div class="flex justify-end">
          <u-button
            label="Сохранить"
            type="submit"
          />
        </div>
      </u-form>

      <template #footer>
        <div class="flex flex-col gap-1 text-xs">
          <span class="block">
            * С помощью этой функции вам будет видно в виджете месяца <span class="italic">(на главной)</span>, сколько
            вам необходимо часов в этом месяце
          </span>
          <span class="block">** <strong>0</strong> - Отключает эту функцию</span>
        </div>
      </template>
    </ui-card>
  </modal-base>
</template>
