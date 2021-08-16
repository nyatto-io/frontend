import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Anime as AnimeContract } from '../../contracts/Anime';
import { Paginated } from '../../contracts/misc';
import { AnimesContext, FavoritesContext, GenresContext } from '../../libraries/contexts';
import { SearchBus } from '../../libraries/events';
import { session } from '../../libraries/session';
import { anime } from '../../misc/constants';
import { makeDummyPagination, outIf, toBool, except, handleError } from '../../misc/helpers';
import Genre from '../Anime/Genre';
import List from '../Anime/List';
import Search from '../Anime/Search';
import View from '../Anime/View';
import Watch from '../Anime/Watch';

type Props = {};

export default function Anime(props: Props) {
	const match = useRouteMatch();
	const [animes, setAnimes] = useState<AnimeContract[]>([]);
	const [animePagination, setAnimePagination] = useState<Paginated<AnimeContract>>(makeDummyPagination());
	const [animesLoaded, setAnimesLoaded] = useState(false);
	const history = useHistory();

	const { fetchGenres } = useContext(GenresContext);
	const { fetchFavorites } = useContext(FavoritesContext);

	const fetchAnimes = async (url?: string, group = 'gogoanime', type = 'fetchAll') => {
		const page = session.get<number>(`${group}-page`) || 1;
		setAnimesLoaded(false);
		try {
			const { data } = await axios.get<Paginated<AnimeContract>>(
				outIf(toBool(url), `${url}&type=${type}`, `/anime/${group}?type=${type}&page=${page}`)
			);
			setAnimes(data.data);
			setAnimePagination({
				...except(data, ['data']),
			});

			session.set(`${group}-page`, data.current_page);
		} catch (error: any) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			setAnimesLoaded(true);
		}
	};

	const url = (path: string) => `${match.path}${path}`;

	useEffect(() => {
		const key = SearchBus.listen<string>('search', (keyword) => {
			if (keyword.length > 3) {
				history.push(url(`/search?search=${keyword}`));
			}
		});

		anime.types.forEach((type) => fetchGenres(type));

		fetchFavorites(undefined, 'anime');

		return () => {
			SearchBus.unlisten('search', key);
		};
		//eslint-disable-next-line
	}, []);

	return (
		<AnimesContext.Provider
			value={{
				animes,
				setAnimes,
				animePagination,
				animesLoaded,
				setAnimesLoaded,
				fetchAnimes,
			}}>
			<Switch>
				<Route path={url('')} exact component={List} />
				<Route path={url('/search')} component={Search} />
				<Route path={url('/genres/:genre')} component={Genre} />
				<Route path={url('/:id')} exact component={View} />
				<Route path={url('/:id/watch/:episode')} component={Watch} />
			</Switch>
		</AnimesContext.Provider>
	);
}
