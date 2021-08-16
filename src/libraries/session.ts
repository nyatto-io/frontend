import { State } from '@avidian/state';

export const session = new (class Session extends State {
	token_key = 'token';

	token(token?: string) {
		if (token) {
			return this.set('token', token);
		}

		return this.get<string>('token');
	}

	hasToken() {
		return this.has('token');
	}

	removeUser() {
		return this.remove('user').remove('user-session');
	}

	revokeToken() {
		return this.remove('token');
	}

	user(user?: any) {
		if (user) {
			return this.set('user', user).set('user-session', user);
		}

		return this.get('user-session') || this.get('user');
	}

	clearAll() {
		return this.clear();
	}
})();
