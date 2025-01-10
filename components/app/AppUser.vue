<script setup lang="ts">
import { useAuthStore } from "~/stores/auth"

const { userName, userAvatarUrl } = storeToRefs(useAuthStore())
</script>

<template>
	<UButton
		color="gray"
		:to="{ name: 'settings' }"
		class="h-fit"
	>
		<UAvatar
			:src="userAvatarUrl"
			:alt="userName"
		/>
		{{ userName }}
	</UButton>
</template>
