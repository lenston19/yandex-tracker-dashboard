import { YandexInfo } from "~/types/yandex-info/yandex-info.entity"

export namespace YandexInfoApi {
	export namespace fetchUser {
		export namespace GET {
			export type ResponseDTO = YandexInfo.Avatar
		}
	}
}
