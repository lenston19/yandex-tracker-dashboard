export namespace YandexInfo {
	export interface Base {
		login: string
		id: string
		client_id: string
		uid: string
		psuid: string
	}

	export interface Avatar extends Base {
		is_avatar_empty: boolean
		default_avatar_id: string
	}
}
