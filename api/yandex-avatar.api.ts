import { $api } from "~/api/base.api"
import { Yandex } from "~/types/yandex-tracker/yandex-tracker.entity"

export default {
	/**
	* Получение аватара пользователя из сервиса https://avatars.yandex.net/get-yapic
	* @param avatarId Идентификатор аватара
	* @param avatarSize Размер аватара Yandex.AvatarSizes
	*
	* @return Blob с аватаром
	*/
	async fetchUserAvatar (avatarId: string, avatarSize: Yandex.AvatarSizes = Yandex.AvatarSizes["islands-200"]) {
		return await $api<Blob>(`/avatar/${avatarId}/${avatarSize}`, {
			method: 'GET',
		})
	},
}
