import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Manga as MangaContract } from '../../contracts/Manga';
import { MangasContext, FavoritesContext, GenresContext } from '../../libraries/contexts';
import { SearchBus } from '../../libraries/events';
import { session } from '../../libraries/session';
import { manga } from '../../misc/constants';
import { makeDummyPagination, outIf, toBool, except, handleError } from '../../misc/helpers';
import Genre from '../Manga/Genre';
import List from '../Manga/List';
import Search from '../Manga/Search';
import View from '../Manga/View';
import Read from '../Manga/Read';
import { Paginated } from '../../contracts/misc';

type Props = {};

export default function Manga(props: Props) {
	const match = useRouteMatch();
	const [mangas, setMangas] = useState<MangaContract[]>([]);
	const [mangaPagination, setMangaPagination] = useState<Paginated<MangaContract>>(makeDummyPagination());
	const [mangasLoaded, setMangasLoaded] = useState(false);
	const history = useHistory();

	const { fetchGenres } = useContext(GenresContext);
	const { fetchFavorites } = useContext(FavoritesContext);

	const fetchMangas = async (url?: string, group = 'mangakakalot', type = 'fetchAll') => {
		const page = session.get<number>(`${group}-page`) || 1;
		setMangasLoaded(false);
		try {
			const { data } = await axios.get<Paginated<MangaContract>>(
				outIf(toBool(url), `${url}&type=${type}`, `/manga/${group}?type=${type}&page=${page}`)
			);
			setMangas(data.data);
			setMangaPagination({
				...except(data, ['data']),
			});

			session.set(`${group}-page`, data.current_page);
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			setMangasLoaded(true);
		}
	};

	const url = (path: string) => `${match.path}${path}`;

	useEffect(() => {
		const key = SearchBus.listen<string>('search', (keyword) => {
			if (keyword.length > 3) {
				history.push(url(`/search?search=${keyword}`));
			}
		});

		manga.types.forEach((type) => fetchGenres(type));

		fetchFavorites(undefined, 'manga');

		return () => {
			SearchBus.unlisten('search', key);
		};
		//eslint-disable-next-line
	}, []);

	return (
		<MangasContext.Provider
			value={{
				mangas,
				setMangas,
				mangaPagination,
				mangasLoaded,
				setMangasLoaded,
				fetchMangas,
			}}>
			<Switch>
				<Route path={url('')} exact component={List} />
				<Route path={url('/search')} component={Search} />
				<Route path={url('/genres/:genre')} component={Genre} />
				<Route path={url('/:id')} exact component={View} />
				<Route path={url('/:id/read/:chapter')} component={Read} />
			</Switch>
		</MangasContext.Provider>
	);
}
