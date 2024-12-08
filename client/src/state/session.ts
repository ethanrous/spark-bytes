import { UserInfo } from '@/api/swag'
import { StateCreator, create } from 'zustand'

export interface SparkBytesSessionT {
	user: User | null
	setUser: (user: User) => void
}

export class User {
	email?: string;
	firstName?: string;
	joinedAt?: string;
	lastName?: string;
	verified?: boolean;

	loggedIn: boolean;

	constructor(init?: UserInfo) {
		if (init) {
			Object.assign(this, init)
			this.loggedIn = true
		} else {
			this.loggedIn = false
		}
	}
}

const SparkBytesSessionControl: StateCreator<SparkBytesSessionT, [], []> = (set) => ({
	user: null,
	setUser: (user: User) => {
		set({
			user: user,
		})
	},
})


export const useSessionStore = create<SparkBytesSessionT>()(SparkBytesSessionControl)
