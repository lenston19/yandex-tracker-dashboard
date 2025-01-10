export namespace YandexTrackerApi {
	export namespace worklogList {
		export type Body = {
			createdBy: string
			createdAt: {
				from: string
				to: string
			}
		}
	}
}
