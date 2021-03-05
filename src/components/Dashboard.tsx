import axios, { AxiosError } from 'axios';
import React, { useContext } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { User } from '../contracts/User';
import { ColorContext } from '../libraries/contexts';
import { session } from '../libraries/session';
import { routes } from '../misc/routes';
import Footer from './Dashboard/Footer';
import Navbar from './Dashboard/Navbar';
import Sidebar from './Dashboard/Sidebar';
import Anime from './Views/Anime';
import Favorites from './Views/Favorites';
import Manga from './Views/Manga';
import Profile from './Views/Profile';
import Settings from './Views/Settings';
import Statistics from './Views/Statistics';

type Props = {};

export default function Dashboard(props: Props) {
	const history = useHistory();
	const { color } = useContext(ColorContext);
	const match = useRouteMatch();

	const url = (path: string) => `${match.path}${path}`;

	if (!session.user()) {
		history.push(routes.LOGIN);
		return null;
	}

	(async () => {
		if (session.hasToken() && session.get('auth-checking') !== true && session.get('auth-checked') !== true) {
			session.set('auth-checking', true);
			try {
				const { data } = await axios.get<User>('/auth/check');
				session.user(data);
			} catch (error) {
				const err = error as AxiosError;
				if (err.response && err.response.status === 401) {
					session.removeUser().revokeToken();
					history.push(routes.LOGIN);
				}
			} finally {
				session.set('auth-checked', true);
				session.set('auth-checking', false);
			}
		}
	})();

	return (
		<div className='wrapper'>
			<Sidebar />
			<div className='main-panel' data-color={color}>
				<Navbar />
				<div className='content'>
					<Switch>
						<Route path={url('')} exact component={Statistics} />
						<Route path={url(routes.PROFILE)} component={Profile} />
						<Route path={url(routes.ANIME)} component={Anime} />
						<Route path={url(routes.MANGA)} component={Manga} />
						<Route path={url(routes.FAVORITES)} component={Favorites} />
						<Route path={url(routes.SETTINGS)} component={Settings} />
					</Switch>
				</div>
				<Footer />
			</div>
		</div>
	);
}
