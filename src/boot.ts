import { session } from './libraries/session';
import './misc/shims';
import axios from 'axios';
import 'typeface-poppins';
import { Model } from '@avidianity/model';

const url = process.env.REACT_APP_BACKEND_URL;

axios.defaults.baseURL = `${url}/api/v1`;

axios.defaults.headers.common['Accept'] = 'application/json';

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
	if (session.has(session.token_key)) {
		const token = session.token();
		config.headers['Authorization'] = `Bearer ${token}`;
	}

	return config;
});

session.listen<string>(session.token_key, (token) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});

Model.setAxios(axios);

session.set('auth-checked', false);

if (session.hasToken() && session.get('auth-checking') !== true && session.get('auth-checked') !== true) {
	session.set('auth-checking', true);
	axios
		.get('/auth/check')
		.then(({ data }) => session.user(data))
		.catch(() => session.removeUser().revokeToken())
		.finally(() => session.set('auth-checking', false).set('auth-checked', true));
}

axios.get(`${url}/sanctum/csrf-cookie`).catch(console.error);
