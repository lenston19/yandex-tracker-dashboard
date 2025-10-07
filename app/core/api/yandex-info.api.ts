import { $api } from '~/core/api'
import type { YandexInfo } from '~/core/types/api/yandex-info/yandex-info.entity'

export default {
  /**
   * Получения данных о пользователе из сервиса https://login.yandex.ru/info
   * @param format - формат возвращаемых данных: 'json' | 'xml' | 'jwt'. По умолчанию 'json'
   * @returns YandexInfo.Avatar
   */
  async fetchUser(format: 'json' | 'xml' | 'jwt' = 'json') {
    return await $api<YandexInfo.Avatar>('/profile/info', {
      method: 'GET',
      params: {
        format
      }
    })
  }
}
