export const useAppVersionStore = defineStore(
	'app-version',
	() => {
		const appVersion = ref<string>('')

		function setVersion(version: string) {
			appVersion.value = version
		}

		return {
			appVersion,
			setVersion
		}
	},
	{ persist: true }
)
