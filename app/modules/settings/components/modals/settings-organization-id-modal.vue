<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { string, object } from 'yup'
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

const { organizationId } = storeToRefs(useSiteSettingsStore())
const model = defineModel<boolean>()

const schema = object({ id: string().required('Поле обязательное') })

const state = reactive({ id: organizationId.value ? organizationId.value : '' })

const save = (close: () => void) => {
  organizationId.value = state.id
  close()
}
</script>

<template>
  <modal-base
    v-slot="{ close }"
    v-model="model"
    :show-close="false"
  >
    <ui-card title="Для дальнейшей работы с приложением нужен ID организации">
      <u-form
        :schema="schema"
        :state="state"
        class="w-full space-y-4"
        @submit="save(close)"
      >
        <u-form-field
          label="Идентификатор"
          name="id"
          class="w-full"
        >
          <u-input
            v-model="state.id"
            color="primary"
            variant="outline"
            class="w-full"
          />
        </u-form-field>

        <div class="flex justify-between">
          <u-button
            to="https://tracker.yandex.ru/admin/orgs"
            target="_blank"
            variant="link"
            class="p-0"
            label="Ключ можно найти здесь :)"
          />
          <u-button
            label="Сохранить"
            type="submit"
          />
        </div>
      </u-form>
    </ui-card>
  </modal-base>
</template>
