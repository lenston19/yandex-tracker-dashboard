export namespace YandexTrackerApi {
  export namespace worklogList {
    export type Date = {
      from: string
      to: string
    }

    export type Body = {
      createdBy: string
      start?: Date
      createdAt?: Date
    }
  }
}
