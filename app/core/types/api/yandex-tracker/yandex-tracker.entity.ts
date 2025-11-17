export namespace Yandex {
  export interface Base {
    self: string
    id: string
    display: string
  }

  export interface BaseWithKey extends Base {
    key: string
  }

  export type TeamUser = Base
  export type IssueType = BaseWithKey
  export type PriorityType = BaseWithKey
  export type QueueVersion = Base
  export type Workflow = Base
  export type Resolution = BaseWithKey

  export interface MySelf extends Omit<Base, 'id'> {
    uid: number
    login: string
    trackerUid: number
    passportUid: number
    cloudUid: string
    firstName: string
    lastName: string
    email: string
    external: boolean
    hasLicense: boolean
    dismissed: boolean
    useNewFilters: boolean
    disableNotifications: boolean
    firstLoginDate: string
    lastLoginDate: string
    welcomeMailSent: boolean
  }

  export interface IssueTypeConfig {
    issueType: IssueType
    workflow: Workflow
    resolutions: Resolution[]
  }

  export type WorklogIssue = BaseWithKey

  export interface Worklog {
    self: string
    id: string
    version: string
    issue: WorklogIssue
    comment: string
    createdBy: Base
    updatedBy: Base
    createdAt: string
    updatedAt: string
    start: string
    duration: string
  }

  export interface Queue extends Omit<Base, 'display'> {
    key: string
    version: number
    name: string
    description: string
    lead: Base
    assignAuto: boolean

    defaultType: IssueType
    defaultPriority: PriorityType

    teamUsers: TeamUser[]
    issueTypes: IssueType[]
    versions: QueueVersion[]
    workflows: Workflow[]

    denyVoting: boolean

    issueTypesConfig: IssueTypeConfig[]
  }

  export enum AvatarSizes {
    'islands-small' = 'islands-small',
    'islands-34' = 'islands-34',
    'islands-middle' = 'islands-middle',
    'islands-50' = 'islands-50',
    'islands-retina-small' = 'islands-retina-small',
    'islands-68' = 'islands-68',
    'islands-75' = 'islands-75',
    'islands-retina-middle' = 'islands-retina-middle',
    'islands-retina-50' = 'islands-retina-50',
    'islands-200' = 'islands-200'
  }
}
