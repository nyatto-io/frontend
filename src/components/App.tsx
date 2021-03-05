import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ColorContext, FavoritesContext, GenresContext } from '../libraries/contexts';
import { session } from '../libraries/session';
import { except, exists, makeDummyPagination, outIf, toBool } from '../misc/helpers';
import { routes } from '../misc/routes';
import '../styles/App.css';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Dashboard from './Dashboard';
import EmailVerified from './EmailVerified';
import Home from './Home';
import Plugin, { Settings } from './Shared/Plugin';
import Splash from './Shared/Splash';
import $ from 'jquery';
import ScrollToTop from './Shared/ScrollToTop';
import axios from 'axios';
import { Genre } from '../contracts/misc';
import { MediaMap } from '../misc/constants';
import { Paginated } from '@avidianity/model';
import { Anime } from '../contracts/Anime';
import { Favorite } from '../contracts/Favorite';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';

function App() {
	const changeSidebarColor = (color: string) => {
		$('.full-page').attr('filter-color', color);
		$('body > .navbar-collapse').attr('data', color);
	};
	const colors = ((settings) => {
		const config = {
			background: 'blue',
			mode: 'dark',
		};

		if (exists(settings, 'background')) {
			const color = settings.background as 'pink' | 'blue' | 'green';

			config.background = color;
			changeSidebarColor(color);
		}

		if (exists(settings, 'mode')) {
			const color = settings.mode as 'dark' | 'light';

			config.mode = color;
		}

		return config;
	})(session.get<Settings | null>('settings') || ({} as Settings));

	const [loaded, setLoaded] = useState(false);
	const [sidebarColor, setSidebarColor] = useState(colors.background);
	const [background, setBackground] = useState(colors.mode);

	const [genres, setGenres] = useState<Genre[]>([]);
	const [loadedGenres, setLoadedGenres] = useState(false);

	const [favorites, setFavorites] = useState<Favorite<Anime>[]>([]);
	const [loadedFavorites, setLoadedFavorites] = useState(false);
	const [favoritePagination, setFavoritePagination] = useState<Paginated<Favorite<Anime>>>(makeDummyPagination());

	const setColor = (color: string) => setSidebarColor(color);

	const fetchGenres = async (type: string) => {
		setLoadedGenres(false);
		try {
			const { data } = await axios.get<Genre[]>(`/${MediaMap[type]}/${type}?type=genres`);
			setGenres(data);
		} catch (error) {
			console.log(error.toJSON());
		} finally {
			setLoadedGenres(true);
		}
	};

	const fetchFavorites = async (url?: string, type = '', keyword = '') => {
		const favoritePage = session.get<number>(`${outIf(type.length > 0, type, 'all')}-favorites-page`) || 1;
		setLoadedFavorites(false);
		try {
			const { data } = await axios.get<Paginated<Favorite<any>>>(
				outIf(
					toBool(url),
					`${url}${outIf(type.length > 0, `&type=${type}`)}${outIf(keyword.length > 0, `&keyword=${keyword}`)}`,
					`/favorites?page=${favoritePage}${outIf(type.length > 0, `&type=${type}`)}${outIf(
						keyword.length > 0,
						`&keyword=${keyword}`
					)}`
				)
			);
			setFavorites(data.data);
			setFavoritePagination({
				...except(data, ['data']),
			});
			session.set(`${outIf(type.length > 0, type, 'all')}-favorites-page`, data.current_page);
		} catch (error) {
			console.log(error.toJSON());
		} finally {
			setLoadedFavorites(true);
		}
	};

	const sendFavoriteRequest = async (type: string, id: any) => {
		const response = await axios.post('/favorites', {
			favorable_type: type,
			favorable_id: id,
		});
		return response.status === 201;
	};

	const loadScripts = async () => {
		try {
			await Promise.all([
				import('jquery'),
				import('popper.js'),
				import('bootstrap'),
				import('perfect-scrollbar'),
				import('chart.js'),
				import('../assets/js/bs-notify'),
				import('../assets/js/bd'),
				import('../assets/js/demo'),
			]);
		} catch (error) {
			console.log(error.toJSON());
		} finally {
			setLoaded(true);
		}
	};

	useEffect(() => {
		loadScripts();
	}, []);

	return (
		<ColorContext.Provider value={{ color: sidebarColor, setColor, background, setBackground: (color) => setBackground(color) }}>
			<GenresContext.Provider
				value={{
					genres,
					setGenres: (genres) => setGenres(genres),
					fetchGenres,
					genresLoaded: loadedGenres,
					setGenresLoaded: setLoadedGenres,
				}}>
				<FavoritesContext.Provider
					value={{
						favorites,
						favoritePagination,
						setLoadedFavorites: (value) => setLoadedFavorites(value),
						loadedFavorites,
						onPaginate: (url) => fetchFavorites(url),
						fetchFavorites,
						sendFavoriteRequest,
					}}>
					<div className={`${outIf(background !== 'dark', 'white-content')}`}>
						<Router>
							{loaded ? (
								<Switch>
									<Route path={routes.HOME} exact component={Home} />
									<Route path={routes.LOGIN} component={Login} />
									<Route path={routes.REGISTER} component={Register} />
									<Route path={routes.DASHBOARD} component={Dashboard} />
									<Route path={routes.EMAIL_VERIFIED} component={EmailVerified} />
									<Route path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
									<Route path={routes.RESET_PASSWORD} component={ResetPassword} />
								</Switch>
							) : (
								<Splash />
							)}
							<Plugin className={`${outIf(!loaded, 'd-none')}`} />
							<ScrollToTop className={`${outIf(!loaded, 'd-none')}`} />
						</Router>
					</div>
				</FavoritesContext.Provider>
			</GenresContext.Provider>
		</ColorContext.Provider>
	);
}

export default App;
