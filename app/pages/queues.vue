<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'

const { queuesModel } = storeToRefs(useQueuesStore())
</script>

<template>
  <div class="grid grid-cols-6 gap-3">
    <ui-card
      v-for="queue in queuesModel"
      :key="queue.id"
      :title="queue.name"
    >
      {{ queue.key }}
    </ui-card>
  </div>
</template>
