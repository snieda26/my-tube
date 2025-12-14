export interface User {
	id: string
	email: string
	name: string | null
	emailVerified?: boolean
	createdAt?: string
	channel: {
		id: string
		handle: string
		avatarPath: string | null
	} | null
}

export interface AuthResponse {
	account: User
	accessToken: string
}

export interface LoginDto {
	email: string
	password: string
}

export interface RegisterDto {
	email: string
	password: string
	name?: string
}

