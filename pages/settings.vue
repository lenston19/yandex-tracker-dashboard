<script setup lang="ts">
import OrganizationWidget from '~/components/settings/widgets/OrganizationWidget.vue'
import UserWidget from '~/components/settings/widgets/UserWidget.vue'
</script>

<template>
	<div class="grid grid-cols-4 gap-4">
		<UserWidget />
		<OrganizationWidget />
	</div>
</template>

<style lang="scss">
</style>
