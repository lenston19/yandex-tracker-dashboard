export const useAppVersionStore = defineStore(
	'app-version',
	() => {
		const appVersion = useCookie('app-version')

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
