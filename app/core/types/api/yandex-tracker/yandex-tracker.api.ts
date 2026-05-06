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

  export namespace issueSearch {
    export type Body = {
      filter?: Record<string, string | string[]>
      query?: string
      order?: string
      fields?: string
    }
  }

  export namespace worklogCreate {
    export type Body = {
      start: string
      duration: string
      comment?: string
    }
  }

  export namespace worklogUpdate {
    export type Body = {
      duration: string
      comment?: string
    }
  }

  export namespace issueTransitionExecute {
    export type Body = {
      estimation?: string
    }
  }
}
