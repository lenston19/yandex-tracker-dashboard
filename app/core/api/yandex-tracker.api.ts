import { $api } from '~/core/api'
import type { YandexTrackerApi } from '~/core/types/api/yandex-tracker/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

export default {
  /**
   * Получение данных о пользователе из сервиса https://api.tracker.yandex.net/v2
   * @return Yandex.MySelf
   */
  async mySelf() {
    return await $api<Yandex.MySelf>('/tracker/myself', {
      method: 'GET'
    })
  },
  /**
   * Получение данных об очередях из сервиса https://api.tracker.yandex.net/v2
   * @return Yandex.Queue[]
   */
  async queuesList(params?: Record<string, string>, countPerPage: number = 50) {
    const queryParams = {
      perPage: countPerPage,
      ...params
    }
    return await $api.raw<Yandex.Queue[]>('/tracker/queues', {
      method: 'GET',
      params: queryParams
    })
  },
  /**
   * Получение данных о учете времени пользователя из сервиса https://api.tracker.yandex.net/v2
   * @param body YandexTrackerApi.worklogList.Body
   * @param params Query params
   * @param countPerPage Количество записей на странице. По умолчанию - 50
   * @return Yandex.Worklog[]
   */
  async worklogList(
    body: YandexTrackerApi.worklogList.Body,
    params?: Record<string, string>,
    countPerPage: number = 50
  ) {
    const queryParams = {
      perPage: countPerPage,
      ...params
    }
    return await $api.raw<Yandex.Worklog[]>('/tracker/worklog/_search', {
      method: 'POST',
      params: queryParams,
      body
    })
  },

  async issueSearch(body: YandexTrackerApi.issueSearch.Body, countPerPage: number = 20, page: number = 1) {
    return await $api<Yandex.Issue[]>('/tracker/issues/_search', {
      method: 'POST',
      params: { perPage: countPerPage, page },
      body
    })
  },

  async issueGet(issueId: string) {
    return await $api<Yandex.Issue>(`/tracker/issues/${issueId}`, {
      method: 'GET'
    })
  },

  async worklogCreate(issueId: string, body: YandexTrackerApi.worklogCreate.Body) {
    return await $api<Yandex.Worklog>(`/tracker/issues/${issueId}/worklog`, {
      method: 'POST',
      body
    })
  },

  async worklogUpdate(issueId: string, worklogId: string, body: YandexTrackerApi.worklogUpdate.Body) {
    return await $api<Yandex.Worklog>(`/tracker/issues/${issueId}/worklog/${worklogId}`, {
      method: 'PATCH',
      body
    })
  },

  async worklogDelete(issueId: string, worklogId: string) {
    return await $api(`/tracker/issues/${issueId}/worklog/${worklogId}`, {
      method: 'DELETE'
    })
  },

  async issueTransitionsList(issueId: string) {
    return await $api<Yandex.Transition[]>(`/tracker/issues/${issueId}/transitions`, {
      method: 'GET'
    })
  },

  async issueTransitionExecute(issueId: string, transitionId: string) {
    return await $api(`/tracker/issues/${issueId}/transitions/${transitionId}/_execute`, {
      method: 'POST',
      body: {}
    })
  }
}
