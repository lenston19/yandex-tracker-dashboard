export namespace Yandex {
	export interface Base {
		self: string
		id: string
		display: string
	}

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

	export interface DefaultType extends Base {
		key: string
	}

	export interface Worklog extends Omit<Base, 'display'> {
		version: string
		issue: DefaultType
		comment: string
		createdBy: Base
		updatedBy: Base
		createdAt: string
		updatedAt: string
		start: string
		duration: string
	}

	export interface DefaultTypeTypesConfig {
		issueTypes: DefaultType
		workflows: Base
		resolutions: DefaultType[]
	}

	export interface Queue extends Omit<Base, 'display'> {
		key: string
		version: number
		name: string
		description: string
		lead: Base
		assignAuto: boolean
		defaultType: DefaultType
		defaultPriority: DefaultType
		teamUsers: Base
		issueTypes: DefaultType
		versions: Base
		workflows: DefaultType[]
		denyVoting: boolean
		issueTypesConfig: DefaultTypeTypesConfig
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
