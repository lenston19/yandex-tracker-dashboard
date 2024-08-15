import { Yandex } from "~/types/yandex-tracker/yandex-tracker.entity"

export namespace YandexTrackerApi {
	export namespace mySelf {
		export namespace GET {
			export type ResponseDTO = Yandex.MySelf
		}
	}
	export namespace queuesList {
		export namespace GET {
			export type ResponseDTO = Yandex.Queue[]
		}
	}
	export namespace worklogList {
		export namespace GET {
			export type RequestDTO = {
				createdBy: string,
				createdAt: {
					from: string,
					to: string,
				}
			}
		}
	}
}
