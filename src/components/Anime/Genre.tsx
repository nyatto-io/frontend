import React, { FC, useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { AnimesContext } from '../../libraries/contexts';
import ByGenres from '../Shared/Media/ByGenres';

type Props = {};

type Match = {
	genre: string;
};

const Genre: FC<Props> = (props) => {
	const { params } = useRouteMatch<Match>();
	const [genre, setGenre] = useState(params.genre);
	const [loading, setLoading] = useState(false);

	const { fetchAnimes, animePagination: pagination, animesLoaded: loaded, animes } = useContext(AnimesContext);

	useEffect(() => {
		if (loading) {
			return;
		}
		setLoading(true);
		fetchAnimes(`/anime/gogoanime?keyword=${genre}`, 'gogoanime', 'search').finally(() => setLoading(false));
		// eslint-disable-next-line
	}, [genre]);

	useEffect(() => {
		setGenre(params.genre);
	}, [params.genre]);

	return (
		<ByGenres
			type='anime'
			group='gogoanime'
			pagination={pagination}
			favorables={animes}
			onPaginate={(url) => fetchAnimes(url)}
			loaded={loaded}
			genre={genre}
		/>
	);
};

export default Genre;
